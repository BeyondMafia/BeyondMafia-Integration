const Meeting = require("./Meeting");

module.exports = class VegReadyMeeting extends Meeting {

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

    getMembers() {
        var members = [];
        var i = 0;

        for (let member of this.members) {
            if (member.visible) {
                members.push({
                    id: member.anonId || member.id,
                    canUpdateVote: member.canUpdateVote,
                    canVote: member.canVote
                });
            }
        }

        return members;
    }

    getMeetingInfo(player) {
        var playerId = player && player.id;
        var member = this.members[playerId] || {};
        var votes = {};
        var voteRecord = [];

        if (this.voting) {
            if (member.id) {
                votes = this.voteVersions[member.id].votes;
                voteRecord = this.voteVersions[member.id].voteRecord;
            }
            else {
                votes = this.votes;
                voteRecord = this.voteRecord;
            }
        }

        return {
            id: this.id,
            name: this.name,
            actionName: this.name,
            members: this.getMembers(),
            group: this.group,
            votesInvisible: this.votesInvisible,
            speech: this.speech,
            voting: this.voting,
            targets: this.targets,
            inputType: this.inputType,
            votes: votes,
            messages: [],
            canUpdateVote: true,
            canUnvote: false,
            canVote: member.canVote,
            amMember: member.id != null,
            voteRecord: this.voteRecord
        };
    }

    vote(voter) {
        if (!this.votes[voter.id]) {
            super.vote(voter, "Kick");

            var otherMeetings = Object.values(this.game.history.states[this.game.currentState].meetings)
                                        .filter(x => x.id !== this.id);
            for (var i = 0; i < otherMeetings.length; i++) {
                if (otherMeetings[i].members[voter.id] !== undefined && otherMeetings[i].noVeg === false) {
                    otherMeetings[i].members[voter.id].canUnvote = false;
                    otherMeetings[i].members[voter.id].canUpdateVote = false;
                }
            }

            this.checkEnoughPlayersKicked();
        }
    }

    checkEnoughPlayersKicked() {
        if (!(Object.keys(this.votes).length >= Math.ceil(this.game.players.length / 3))){
            return;
        }

        var otherMeetings = Object.values(this.game.history.states[this.game.currentState].meetings)
                                    .filter(x => x.id !== this.id);
        for (var i = 0; i < otherMeetings.length; i++) {
            for( var j = 0; j < otherMeetings[i].members.length; j++) {
                Object.values(otherMeetings[i].members)[j].canUnvote = false;
                if (Object.values(Object.keys(otherMeetings[i].votes))
                .filter(x => x === Object.values(
                    Object.values(otherMeetings)[i].members)[j].id)[0] !== undefined) {
                    Object.values(otherMeetings[i].members)[j].canUpdateVote = false;
                }
            }
        }

        if (!this.finished) {
            this.finished = true;
            this.game.timers.vegKick.setTime(this.vegCounter);
            this.game.sendAlert("Enough kicks, vegging players!");
        }
    }

    checkReady() { }

    finish() { }

}
