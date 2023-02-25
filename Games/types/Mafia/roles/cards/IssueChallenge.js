const Card = require("../../Card");
const { PRIORITY_DAY_DEFAULT } = require("../../const/Priority");

module.exports = class IssueChallenge extends Card {

    constructor(role) {
        super(role);

        this.meetings = {
            "Issue Challenge": {
                states: ["Day"],
                flags: ["voting", "noVeg"],
                targets: { include: ["alive"], exclude: [""] },
                action: {
                    labels: ["giveItem", "Invitation"],
                    priority: PRIORITY_DAY_DEFAULT,
                    run: function() {
                        this.data.challenger = this.actor.name;
                        this.data.challenged = this.target.name;
                    }
                }
            },
            "Challenger": {
                actionName: "Challenge",
                states: ["Night"],
                flags: ["voting"],
                inputType: "alignment",
                targets: ["Rock", "Paper", "Scissors"],
                shouldMeet: function () {
                    if (this.actor.name == this.data.challenger)
                        return true;
                    
                    return false;
                },
                action: {
                    labels: ["challenge"],
                    priority: PRIORITY_CHALLENGE,
                    run: function () {
                        this.data.rps1 = this.target;
                    }
                },
            "Challenged": {
                actionName: "Challenge",
                states: ["Night"],
                flags: ["voting"],
                inputType: "alignment",
                targets: ["Rock", "Paper", "Scissors"],
                shouldMeet: function () {
                    if (this.actor.name == this.data.challenged)
                        return true;
                    
                    return false;
                },
                action: {
                    labels: ["challenge"],
                    priority: PRIORITY_CHALLENGE,
                    run: function () {
                        this.data.rps2 = this.target;
                    }
                },
        };
    }

}
