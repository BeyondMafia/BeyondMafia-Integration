const Card = require("../../Card");
const { PRIORITY_OVERTHROW } = require("../../const/Priority");

module.exports = class OverturnVote extends Card {

    constructor(role) {
        super(role);

        this.meetings = {
            "Overturn Vote": {
                states: ["Overturn"],
                flags: ["group", "speech", "voting", "anonymousVotes"],
                targets: { include: ["alive"], exclude: ["dead", "self"] },
                leader: true,
                action: {
                    priority: PRIORITY_OVERTHROW,
                    power: 3,
                    labels: ["kill"],
                    run: function () {
                        this.actor.role.data.actionToOverthrow.cancel(true);
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
                            this.data.actionToOverthrow = action;
                            break;
                        }
                    }

                    if (isNoVote) {
                        this.data.actionToOverthrow = null;
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