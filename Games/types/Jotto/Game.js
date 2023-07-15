const Game = require("../../core/Game");
const Player = require("./Player");
const History = require("./History");
const Queue = require("../../core/Queue");
const Winners = require("./Winners");
const Action = require("./Action");

module.exports = class JottoGame extends Game {

    constructor(options) {
        options.History = History;
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

        this.opponentSelected = false;
        this.guessQueue = new Queue();
        this.chosenWordQueue = new Queue();
    }

    async playerLeave(player) {
        if (this.started && !this.finished) {
            this.instantAction(new Action({
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

    getGuessScore(player, word) {
        let opponentWord = this.players[player.role.targetId].role.chosenWord;

        if (word == opponentWord)
            return 6;
        
        for (let letter of word) {
            opponentWord = opponentWord.replace(letter, "");
        }

        return 5 - opponentWord.length;
    }

    assignRoles() {
        super.assignRoles();

        let playerArray = this.players.array();
        // Creates a loop of opponents. Likely depends on join order, may add randomization in the future
        for (let i in playerArray) {
            const idx = Number(i);
            const aidx = ((idx-1)+playerArray.length) % playerArray.length;
            const tidx = (idx+1)%playerArray.length;

            let player = playerArray[idx];
            let attacker = playerArray[aidx];
            let target = playerArray[tidx];

            player.role.attackerId = attacker.id;
            player.role.targetId = target.id;

            // Initialize empty guesses and opponent records
            this.recordGuess(player);
            this.recordOpponents(player, attacker.id, target.id);

            // Tell everyone who opponents are
            this.broadcast("jottoinit", { playerId: player.id, attackerId: attacker.id, targetId: target.id });

            // No need to hide Jotter role
            let appearance = `${player.role.name}:${player.role.modifier}`
            this.recordRole(player, appearance);
            this.broadcast("reveal", { playerId: player.id, role: appearance });
        }

        this.opponentSelected = true;
    }

    recordOpponents(player, attackerId, targetId) {
        for (let _player of this.players) {
            _player.history.recordOpponents(player, attackerId, targetId);
        }

        this.spectatorHistory.recordOpponents(player, attackerId, targetId);
    }

    // When a word is guessed, queue it for broadcasting
    queueGuess(player, word, score) {
        this.guessQueue.enqueue({ player, word, score });
    }

    processGuessQueue() {
        for (let item of this.guessQueue) {
            this.recordGuess(item.player);
            this.broadcast("jottoguess", { playerId: item.player.id, word: item.word, score: item.score });
        }

        this.guessQueue.empty();
    }

    recordGuess(player) {
        for (let _player of this.players) {
            _player.history.recordGuess(player);
        }

        this.spectatorHistory.recordGuess(player);
    }

    // When a word is chosen, queue it for sending to player
    queueChosenWord(player, word, score) {
        this.chosenWordQueue.enqueue({ player, word, score });
    }

    processChosenWordQueue() {
        for (let item of this.chosenWordQueue) {
            this.recordChosenWord(item.player, item.word, item.score);
            
            item.player.send("jottoreveal", { playerId: item.player.id, word: item.word });
        }

        this.chosenWordQueue.empty();
    }

    recordChosenWord(player, word) {
        player.history.recordChosenWord(player, word);
    }

    // Override to also reveal jotto words
    revealAllPlayers() {
        for (let player of this.players) {
            this.broadcast("reveal", { playerId: player.id, role: `${player.role.name}:${player.role.modifier}` });
            this.broadcast("jottoreveal", { playerId: player.id, word: player.role.chosenWord });
            player.removeAllEffects();
        }
    }

    historySnapshot() {
        super.historySnapshot();

        // Jotto snapshot
        this.history.recordAllGuesses();
        this.history.recordAllChosenWords();
        this.history.recordAllOpponents();
    }

    processStateQueues() {
        super.processStateQueues();

        // Jotto Queues
        this.processGuessQueue();
        this.processChosenWordQueue();
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

        // Last remaining player wins by default
        if (this.alivePlayers().length === 1) {
            winners.addPlayer(this.alivePlayers()[0]);
            finished = true;
        } 
        // Nobody remains, no one wins
        else if (this.alivePlayers().length === 0) {
            winners.addGroup("No one");
            finished = true;
        }
        winners.determinePlayers();

        return [finished, winners];
    }

}