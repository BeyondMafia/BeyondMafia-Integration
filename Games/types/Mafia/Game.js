const Game = require("../../core/Game");
const Player = require("./Player");
const Queue = require("../../core/Queue");
const Winners = require("../../core/Winners");
const Action = require("./Action");
const stateEventMessages = require("./templates/stateEvents");

module.exports = class MafiaGame extends Game {

    constructor(options) {
        super(options);

        this.type = "Mafia";
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
                name: "Day",
                length: options.settings.stateLengths["Day"]
            }
        ];
        this.extendLength = options.settings.extendLength;
        this.dayCount = 0;
        this.spectatorMeetFilter = {
            "Village": true,
            "Pregame": true,
            "Postgame": true
        };
        this.stateEventMessages = stateEventMessages;
        this.noDeathLimit = 6;
        this.statesSinceLastDeath = 0;
        this.resetLastDeath = false;
        this.extensions = 0;
        this.extensionVotes = 0;

    }

    async playerLeave(player) {
        if (this.started) {
            this.queueAction(new Action({
                actor: player,
                target: player,
                game: this,
                run: function () {
                    this.target.kill("leave", this.actor);
                }
            }));

            if (!this.finished) {
                player.recordStat("survival", false);
                player.recordStat("abandons", true);
            }
        }

        await super.playerLeave(player);
    }

    async vegPlayer(player, playerIsKicklynched) {
        player.recordStat("abandons", true);
        super.vegPlayer(player, playerIsKicklynched);
    }

    start() {
        super.start();

        for (let player of this.players)
            player.recordStat("totalGames");
    }

    incrementState() {
        super.incrementState();

        if (this.getStateName() == "Day")
            this.dayCount++;
    }

    getStateInfo(state) {
        var info = super.getStateInfo(state);
        info.dayCount = this.dayCount;

        if (info.name != "Pregame" && info.name != "Postgame") {
            info = {
                ...info,
                name: `${info.name} ${this.dayCount}`
            }
        }

        return info;
    }

    isMustAct() {
        var mustAct = super.isMustAct();
        mustAct |= this.statesSinceLastDeath >= this.noDeathLimit && this.getStateName() != "Sunset";
        return mustAct;
    }

    inactivityCheck() {
        var stateName = this.getStateName();

        if (
            !this.resetLastDeath &&
            (stateName == "Day" || stateName == "Night")
        ) {
            this.statesSinceLastDeath++;

            if (this.statesSinceLastDeath >= this.noDeathLimit) {
                if (stateName != "Day")
                    this.queueAlert("No one has died for a while, you must act.")
                else
                    this.queueAlert("A giant meteor will destroy the town and no one will win if no one dies today.")
            }
        }
        else if (this.resetLastDeath) {
            this.statesSinceLastDeath = 0;
            this.resetLastDeath = false;
            this.meteorImminent = false;
        }
    }

    gotoNextState() {
        var prevStateName = this.getStateName();

        if ((!this.timers["secondary"] || !this.timers["secondary"].done) && prevStateName == "Day") {
            for (let meeting of this.meetings) {
                if (meeting.name != "Village")
                    continue;

                for (let member of meeting.members)
                    if (member.canVote && !meeting.votes[member.id] && !member.player.votedForExtension)
                        this.extensionVotes++;

                var aliveCount = this.alivePlayers().length;
                var votesNeeded = Math.ceil(aliveCount / 2) + this.extensions;

                if (this.extensionVotes < votesNeeded || this.isTest)
                    break;

                this.timers["main"].extend(this.extendLength * 60 * 1000);
                this.extensions++;
                this.extensionVotes = 0;

                for (let player of this.players)
                    player.votedForExtension = false;

                this.sendAlert("Day extended due to a lack of votes.");
                return;
            }
        }

        this.extensions = 0;
        this.extensionVotes = 0;

        for (let player of this.players)
            player.votedForExtension = false;

        if (this.statesSinceLastDeath >= this.noDeathLimit && prevStateName == "Day")
            this.meteorImminent = true;

        super.gotoNextState();
    }

    isNoAct() {
        return this.setup.dawn &&
            this.getStateName() == "Night" &&
            (this.dayCount == 0 || (this.dayCount == 1 && this.setup.startState == "Day"));
    }

    checkGameEnd() {
        var finished = super.checkGameEnd();

        if (finished)
            return finished;

        if (this.meteorImminent && !this.resetLastDeath) {
            this.queueAlert("A giant meteor obliterates the town!");

            var winners = new Winners(this);
            winners.addGroup("No one");
            this.endGame(winners);

            return true;
        }
    }

    checkWinConditions() {
        var finished = false;
        var counts = {};
        var winQueue = new Queue();
        var winners = new Winners(this);
        var aliveCount = this.alivePlayers().length;

        for (let player of this.players) {
            let alignment = player.role.winCount || player.role.alignment;

            if (!counts[alignment])
                counts[alignment] = 0;

            if (player.alive)
                counts[alignment]++;

            winQueue.enqueue(player.role.winCheck);
        }

        for (let winCheck of winQueue) {
            let stop = winCheck.check(counts, winners, aliveCount, false);
            if (stop) break;
        }

        if (winners.groupAmt() > 0)
            finished = true;
        else if (aliveCount == 0) {
            winners.addGroup("No one");
            finished = true;
        }

        if (finished)
            for (let winCheck of winQueue)
                if (winCheck.againOnFinished)
                    winCheck.check(counts, winners, aliveCount, true);

        winners.determinePlayers();
        return [finished, winners];
    }

    async endGame(winners) {
        for (let player of this.players) {
            if (player.won)
                player.recordStat("wins", true);
            else
                player.recordStat("wins", false);
        }

        await super.endGame(winners);
    }

    getGameTypeOptions() {
        return {
            extendLength: this.extendLength,
        };
    }

}