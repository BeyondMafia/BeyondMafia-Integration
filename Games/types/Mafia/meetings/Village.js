const Meeting = require("../Meeting");

module.exports = class VillageMeeting extends Meeting {

    constructor(game) {
        super(game, "Village");

        this.actionName = "Village Vote";
        this.group = true;
        this.speech = true;
        this.voting = true;
        this.targets = { include: ["alive"], exclude: [] }
    }

    vote(voter, selection) {
        var voted = super.vote(voter, selection);

        if (
            voted &&
            Object.keys(this.votes).length == this.totalVoters - 1 &&
            this.game.timers["main"] &&
            !this.game.timers["secondary"]
        ) {
            this.game.createTimer("secondary", 30000, this.game.timers["main"].then);
        }
    }

    unvote(voter) {
        var unvoted = super.unvote(voter);

        if (unvoted && this.game.timers["secondary"])
            this.game.clearTimer("secondary");
    }

    finish(isVote) {
        super.finish(isVote);

        for (let member of this.members) {
            if (member.player.role.alignment == "Village" && this.votes[member.id] && this.votes[member.id] != "*") {
                let role = this.game.getPlayer(this.votes[member.id]).role;

                if (role.alignment != "Village" && role.winCount != "Village")
                    member.player.recordStat("reads", true);
                else
                    member.player.recordStat("reads", false);
            }

            if (member.player == this.finalTarget)
                member.player.recordStat("survival", false);
            else
                member.player.recordStat("survival", true);
        }
    }

}
