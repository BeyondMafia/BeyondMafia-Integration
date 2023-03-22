const Player = require("../../core/Player");
const deathMessages = require("./templates/death");
const revivalMessages = require("./templates/revival");

module.exports = class MafiaPlayer extends Player {

    constructor(user, game, isBot) {
        super(user, game, isBot);

        this.deathMessages = deathMessages;
        this.revivalMessages = revivalMessages;
        this.votedForExtension = false;
    }

    getRevealType(deathType) {
        if (deathType == "lynch")
            return "lynch";
        else
            return "death";
    }

    parseCommand(message) {
        var cmd = super.parseCommand(message);

        if (!cmd)
            return;

        switch (cmd.name) {
            case "extend":
                var kickMeeting = super.getVegKickMeeting();
                if (kickMeeting) {
                    return;
                }
                if (this.game.getStateName() != "Day" || this.votedForExtension || !this.alive)
                    return;

                this.votedForExtension = true;
                this.game.extensionVotes++;

                var aliveCount = this.game.alivePlayers().length;
                var votesNeeded = Math.ceil(aliveCount / 2) + this.game.extensions;

                if (votesNeeded > aliveCount) {
                    this.sendAlert("Unable to extend the Day further.");
                    return;
                }

                this.game.sendAlert(`${this.name} voted for an extension of the Day using /extend. ${this.game.extensionVotes}/${votesNeeded} votes.`);

                if (this.game.extensionVotes < votesNeeded)
                    return;

                this.game.timers["main"].extend(3 * 60 * 1000);
                this.game.extensions++;
                this.game.extensionVotes = 0;

                for (let player of this.game.players)
                    player.votedForExtension = false;

                this.game.sendAlert("Day extended.");
                return;
        }
    }

}