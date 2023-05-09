const Game = require("../../core/Game");
const Player = require("./Player");
const Action = require("./Action");
const Queue = require("../../core/Queue");
const Winners = require("../../core/Winners");

const Random = require("../../../lib/Random");
const wordList = require("./data/words");

module.exports = class GhostGame extends Game {

    constructor(options) {
        super(options);

        this.type = "Ghost";
        this.Player = Player;
        this.states = [
            {
                name: "Postgame"
            },
            {
                name: "Pregame"
            },
            {
                name: "Night",
                length: options.settings.stateLengths["Night"],
                skipChecks: [
                    () => this.playerGivingClue
                ]
            },
            {
                name: "Give Clue",
                length: options.settings.stateLengths["Give Clue"],
            },
            {
                name: "Day",
                length: options.settings.stateLengths["Day"],
                skipChecks: [
                    () => this.playerGivingClue
                ]
            },
            {
                name: "Guess Word",
                length: options.settings.stateLengths["Guess Word"],
                skipChecks: [
                    () => this.playerGivingClue
                ]
            }
        ];

        // game settings
        this.configureWords = options.settings.configureWords;
        this.wordLength = options.settings.wordLength;
        this.townWord = options.settings.townWord;
        this.foolWord = options.settings.townWord;

        // giving clue
        this.playerGivingClue = false;
        this.currentPlayerList = [];
        this.startIndex = -1;
        this.currentIndex = -1;

        this.responseHistory = [];
        this.currentClueHistory = [];        
    }

    start() {
        if (!this.configureWords) {
            let wordPack = Random.randArrayVal(wordList);
            let shuffledWordPack = Random.randomizeArray(wordPack);
            this.townWord = shuffledWordPack[0];
            this.foolWord = shuffledWordPack[1];
            this.wordLength = this.townWord.length;
        }

        super.start();
    }

    startRoundRobin(firstPick) {
        this.currentPlayerList = this.alivePlayers();
        this.startIndex = this.currentPlayerList.indexOf(firstPick);
        this.currentIndex = this.startIndex;

        firstPick.holdItem("Microphone");
        this.playerGivingClue = true;
    }

    incrementCurrentIndex() {
        this.currentIndex = (this.currentIndex + 1) % this.currentPlayerList.length;
    }

    incrementState() {
        let previousState = this.getStateName();

        if (previousState == "Give Clue") {
            this.incrementCurrentIndex();
            while (true) {
                if (this.currentIndex == this.startIndex) {
                    this.playerGivingClue = false;
                    this.responseHistory.push({
                        "type": "clue",
                        "data": this.currentClueHistory,
                    })
                    this.currentClueHistory = [];
                    break;
                }

                let nextPlayer = this.currentPlayerList[this.currentIndex];
                if (nextPlayer.alive) {
                    nextPlayer.holdItem("Microphone");
                    break
                }
                this.incrementCurrentIndex();
            }
        }

        super.incrementState();
    }

    recordClue(player, clue) {
        this.currentClueHistory.push({
            "name": player.name,
            "clue": clue
        })
    }

    recordGuess(player, guess) {
        let data = {
            "name": player.name,
            "guess": guess,
        };

        this.responseHistory.push({
            "type": "guess",
            "data": data
        })
    }

    getStateInfo(state) {
        var info = super.getStateInfo(state);
        info.extraInfo = {
            "history": this.responseHistory,
            "current": this.currentClueHistory
        }
        return info;
    }

    // process player leaving immediately
    async playerLeave(player) {
        if (this.started) {
            let action = new Action({
                actor: player,
                target: player,
                game: this,
                run: function () {
                    this.target.kill("leave", this.actor, true);
                }
            });

            this.instantAction(action);
        }

        await super.playerLeave(player);
    }

    checkWinConditions() {
        var finished = false;
        var counts = {};
        var winQueue = new Queue();
        var winners = new Winners(this);
        var aliveCount = this.alivePlayers().length;

        for (let player of this.players) {
            let alignment = player.role.alignment;

            if (!counts[alignment])
                counts[alignment] = 0;

            if (player.alive)
                counts[alignment]++;

            winQueue.enqueue(player.role.winCheck);
        }

        for (let winCheck of winQueue) {
            winCheck.check(counts, winners, aliveCount);
        }

        if (winners.groupAmt() > 0)
            finished = true;
        else if (aliveCount == 0) {
            winners.addGroup("No one");
            finished = true;
        }

        winners.determinePlayers();
        return [finished, winners];
    }

    getGameTypeOptions() {
        return {
            disableRehost: true,
        };
    }



}