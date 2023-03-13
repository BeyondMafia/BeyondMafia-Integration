const Meeting = require("./Meeting");

module.exports = class VegReadyMeeting extends Meeting {

    constructor(game) {
        super(game, "Veg Ready");

        this.group = true;
        this.voting = true;
        this.noRecord = false;
        this.noVeg = true;
        this.vegCounter = 15000;

        this.inputType = "button";
        this.targets = ["Kick"];
        this.votes = {};
        this.voteRecord = [];
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

        if (this.voting) {
                votes = this.votes;
        }

        return {
            id: this.id,
            name: this.name,
            actionName: this.name,
            members: this.getMembers(),
            group: this.group,
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
        if (this.finished || this.members[voter.id].ready){
            return;
        }

        this.members[voter.id].ready = true;
        this.votes[voter.id] = "Kick";
        this.members[voter.id].player.seeVote({ voter, target: "Kick", meeting: this }, true);
        this.game.sendAlert(`${voter.name} has kicked.`);
        this.checkEnoughPlayersKicked();
    }

    checkEnoughPlayersKicked() {
        var kicks = 0;
        for (let member of this.members){
            if (member.ready){
                kicks++;
            }
        }
        if (!(kicks >= Math.ceil(this.members.length / 3))){
            return;
        }

        this.finished = true;
        this.game.timers.vegKick.setTime(this.vegCounter);
        this.game.sendAlert("Enough kicks, vegging players!");
    }

    checkReady() { }

    finish() { }

}
