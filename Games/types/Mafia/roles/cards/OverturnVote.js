const Card = require("../../Card");
const { PRIORITY_OVERTHROW_VOTE } = require("../../const/Priority");

module.exports = class OverturnVote extends Card {

    constructor(role) {
        super(role);

        this.meetings = {
            "Overturn Vote": {
                meetingName: "Overturn",
                states: ["Overturn"],
                flags: ["group", "speech", "voting", "anonymousVotes"],
                targets: { include: ["alive"], exclude: ["dead", "self"] },
                leader: true,
                action: {
                    power: 3,
                    labels: ["kill", "lynch", "overthrow"],
                    priority: PRIORITY_OVERTHROW_VOTE,
                    run: function () {
                        for (let action of this.game.actions[0]) {
                            if (action.hasLabel("lynch") && !action.hasLabel("overthrow")) {
                                if (action.target === this.target) {
                                    return;
                                }
                                
                                // Only one village vote can be overthrown
                                action.cancel(true);
                                break;
                            }
                        }
                        
                        if (this.dominates()) {
                            this.target.kill("lynch", this.actor);
                        }

                        --this.actor.role.data.overturnsLeft;
                    }
                }
            },
        };

        this.stateMods = {
            "Day": {
                type: "delayActions",
                delayActions: true
            },
            "Overturn": {
                type: "add",
                index: 4,
                length: 1000 * 30,
                shouldSkip: function () {
                    if (!this.data.overturnsLeft) {
                        return true;
                    }

                    let isNoVote = true;
                    for (let action of this.game.actions[0]) {
                        if (action.hasLabel("lynch")) {
                            isNoVote = false;
                            break;
                        }
                    }

                    if (isNoVote) {
                        return true;
                    }
                            
                    for (let player of this.game.players) {
                        player.holdItem("OverturnSpectator");
                    }
                    return false;
                }
            }
        };
    }

}