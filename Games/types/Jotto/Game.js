const Game = require("../../core/Game");
const Player = require("./Player");
const Queue = require("../../core/Queue");
const Winners = require("./Winners");
const Action = require("./Action");

module.exports = class JottoGame extends Game {

    constructor(options) {
        super(options);

        this.type = "Jotto";
        this.Player = Player;
        this.states = [
            {
                name: "Postgame"
            },
            {
                name: "Pregame"
            },
            {
                name: "Choose Word",
                length: options.settings.stateLengths["Choose Word"]
            },
            {
                name: "Guess Word",
                length: options.settings.stateLengths["Guess Word"]
            }
        ];

        this.wordHistory = [];  // Would only have 2 words, but maybe useful for "rematching" in the future
        this.guessHistory = [];

        this.opponentSelected = false;
    }

    async playerLeave(player) {
        if (this.started) {
            this.queueAction(new Action({
                actor: player,
                target: player,
                game: this,
                run: function () {
                    this.target.kill("leave", this.actor, true);
                }
            }));
        }

        await super.playerLeave(player);
    }

    async endGame(winners) {
        await super.endGame(winners);

        let ei = {
            "wordHistory": this.wordHistory.map(a => ({...a})),
            "guessHistory": this.guessHistory.map(a => ({...a}))
        };
        if (this.opponentSelected) {
            ei["opponents"] = this.players.reduce((acc, p) => ({ 
                ...acc, 
                [p.id]: {
                    target: p.role.opponentTargetId,
                    attacker: p.role.opponentAttackerId
                }
            }), {});
        }
        this.addStateExtraInfoToHistories(ei);
    }

    assignRoles() {
        super.assignRoles();

        let playerArray = this.players.array();
        // Creates a loop of opponents. Likely depends on join order, may add randomization in the future
        for (let i in playerArray) {
            const idx = Number(i);
            playerArray[idx].role.opponentTargetId = playerArray[(idx+1)%playerArray.length].id;
            playerArray[(idx+1)%playerArray.length].role.opponentAttackerId = playerArray[idx].id;
        }

        this.opponentSelected = true;
    }

    getGuessScore(player, word) {
        let opponentWord = this.players[player.role.opponentTargetId].role.chosenWord;

        if (word == opponentWord) {
            return 6;
        }
        
        for (let letter of word) {
            opponentWord = opponentWord.replace(letter, "");
        }

        return 5 - opponentWord.length;
    }

    getStateInfo(state) {
        let info = super.getStateInfo(state);

        info.extraInfo = {
            "wordHistory": this.wordHistory.map(a => ({...a})),
            "guessHistory": this.guessHistory.map(a => ({...a}))
        }

        if (this.opponentSelected) {
            info.extraInfo["opponents"] = this.players.reduce((acc, p) => ({ 
                ...acc, 
                [p.id]: {
                    target: p.role.opponentTargetId,
                    attacker: p.role.opponentAttackerId
                }
            }), {});
        }

        return info;
    }

    // Override getNextStateIndex()
    // There should be no skipping, and the "Guess Word" state should repeat itself until a winner is found.
    getNextStateIndex() {
        var lastStateIndex = this.stateIndexRecord[this.stateIndexRecord.length - 1];
        var skipped = -1;
        var nextStateIndex;

        if (lastStateIndex == null)
            nextStateIndex = 2 + this.stateOffset - 1;
        else
            nextStateIndex = lastStateIndex;

        // Move on
        nextStateIndex++;
        skipped++;

        // If we're at the end, then stop moving on until a win
        if (nextStateIndex == this.states.length)
            nextStateIndex--;

        return [nextStateIndex, skipped];
    }

    recordWord(player, word) {
        this.wordHistory.push({
            "pid": player.id,
            "word": word
        });
    }

    recordGuess(player, word, score) {
        this.guessHistory.push({
            "pid": player.id,
            "word": word,
            "score": score
        });
    }

    checkWinConditions() {
        let finished = false;
        let winQueue = new Queue();
        let winners = new Winners(this);

        for (let player of this.players) {
            winQueue.enqueue(player.role.winCheck);
        }

        for (let winCheck of winQueue) {
            winCheck.check(winners);
        }

        winners.determinePlayers();

        // Even if opponent leaves, if player guessed correctly, it's technically their win
        if (winners.groupAmt() > 0) {
            finished = true
        }
        // Missing at least one player, inconclusive
        else if (this.alivePlayers().length < 2) {
            winners.addGroup("No one");
            finished = true;
        }
        return [finished, winners];
    }

}