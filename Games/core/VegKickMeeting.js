const Meeting = require("./Meeting");

module.exports = class VegKickMeeting extends Meeting {

    constructor(game) {
        super(game, "Vote Kick");

        this.group = true;
        this.voting = true;
        this.noVeg = true;
        this.vegCounter = 15000;
        this.inputType = "button";
        this.targets = ["Kick"];
        this.votesInvisible = true;
    }

    getMeetingInfo(player) {
        let info = super.getMeetingInfo(player);
        info.canUpdateVote = true;
        info.canUnvote = false;
        return info;
    }

    vote(voter) {
        if (this.votes[voter.id]) {
            return
        }
        super.vote(voter, "Kick");

        // player has voted, disable unvote and update vote for them
        var allMeetings = this.members[voter.id].player.getMeetings();
        for (let meeting of allMeetings) {
            if (meeting.id === this.id || meeting.noVeg === true) {
                continue;
            }

            meeting.members[voter.id].canUnvote = false;
            if (meeting.votes[voter.id] !== undefined) {
                meeting.members[voter.id].canUpdateVote = false;
            }
        }

        this.checkEnoughPlayersKicked();
    }

    checkEnoughPlayersKicked() {
        var numAlive = Object.values(this.game.players).filter(x => x.alive).length;
        let vegKickThreshold = Math.ceil(numAlive / 3);
        if (this.votes.length < vegKickThreshold) {
            return;
        }

        // disable vote for everyone
        // set canUnvote = false
        // if the player has voted, set canUpdateVote = false
        var allMeetings = this.game.getMeetings();
        for (let meeting of allMeetings) {
            if (meeting.id === this.id) {
                continue;
            }

            for (let member of meeting.members) {
                member.canUnvote = false;
                if (meeting.votes[member.id] !== undefined) {
                    member.canUpdateVote = false;
                }
            }
        }

        if (!this.finished) {
            this.finished = true;
            // this.game.timers.vegKick.setTime(this.vegCounter);
            this.game.createTimer("vegKick", this.vegCounter, () => this.game.gotoNextState());
            this.game.sendAlert("Enough kicks, vegging players!");
        }
    }

    checkReady() { }

    finish() { }

}
