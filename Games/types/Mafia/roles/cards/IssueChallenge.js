const Card = require("../../Card");
const { PRIORITY_DAY_DEFAULT } = require("../../const/Priority");

module.exports = class IssueChallenge extends Card {

    constructor(role) {
        super(role);

        this.meetings = {
            "Issue Challenge": {
                states: ["Day"],
                flags: ["voting"],
                action: {
                    labels: ["jail"],
                    priority: PRIORITY_DAY_DEFAULT,
                    run: function () {
                        if (this.dominates()) {
                            this.target.holdItem("Challenge");
                            this.actor.role.data.challenged = this.target;
                        }
                    }
                }
            },
            "Challenger": {
                actionName: "Challenge",
                states: ["Night"],
                flags: ["voting"],
                inputType: "alignment",
                targets: ["Rock", "Paper", "Scissors"],
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
                    if (this.actor.hasItem("Challenge"))
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
