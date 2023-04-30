const Game = require("../../core/Game");
const Player = require("./Player");
const Queue = require("../../core/Queue");
const Winners = require("../../core/Winners");

module.exports = class Ghost extends Game {

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
                length: options.settings.stateLengths["Night"]
            },
            {
                name: "Give Clue",
                length: options.settings.stateLengths["Give Clue"]
            },
            {
                name: "Day",
                length: options.settings.stateLengths["Day"]
            }
        ];
        this.townWord = this.setup.townWord;
        this.foolWord = this.setup.foolWord;
        this.startIndex = -1;
        this.currentIndex = -1;
    }

    startRoundRobin(firstPick) {
        this.startIndex = this.players.indexOf(firstPick);
        this.currentIndex = this.startIndex;

        firstPick.holdItem("Microphone");
    }

    gotoNextState() {
        if (this.getStateName() != "Give Clue") {
            super.gotoNextState();
            return;
        }

        // drop item
        let currentPlayer = this.players.at(this.currentIndex);
        currentPlayer.dropItem("Microphone");

        // increment index
        this.currentIndex = (this.currentIndex + 1) % this.players.length;
        if (this.currentIndex == this.startIndex) {
            super.gotoNextState();
            return;
        }

        // hold item
        let nextPlayer = this.players.at(this.currentIndex);
        let item = nextPlayer.holdItem("Microphone");
        this.instantMeeting(item.meetings, [nextPlayer]);
    }

    getStateInfo(state) {
        var info = super.getStateInfo(state);
        return info;
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

}