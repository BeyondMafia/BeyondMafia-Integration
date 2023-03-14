const Meeting = require("./Meeting");

module.exports = class VegReadyMeeting extends Meeting {

    constructor(game) {
        super(game, "Veg Ready");

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
            canVote: true,
            canUnvote: false,
            amMember: member.id != null,
            voteRecord: this.voteRecord
        };
    }

    vote(voter) {
        super.vote(voter, "Kick");
        this.checkEnoughPlayersKicked();
    }

    checkEnoughPlayersKicked() {
        if (!(Object.keys(this.votes).length >= Math.ceil(this.members.length / 3))){
            return;
        }

        this.finished = true;
        this.game.timers.vegKick.setTime(this.vegCounter);
        this.game.sendAlert("Enough kicks, vegging players!");
    }

    checkReady() { }

    finish() { }

}
