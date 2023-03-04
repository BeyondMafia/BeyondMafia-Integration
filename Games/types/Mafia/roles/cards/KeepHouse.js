const Card = require("../../Card");
const { PRIORITY_CLEAN_DEATH } = require("../../const/Priority");

module.exports = class KeepHouse extends Card {

    constructor(role) {
        super(role);

        this.meetings = {
            "Housekeep": {
                states: ["Night"],
                flags: ["voting"],
                inputType: "boolean",
                action: {
                    labels: ["clean", "stealItem"],
                    priority: PRIORITY_CLEAN_DEATH,
                    run: function () {
                        if (this.target == "No")
                            return;

                        let killedTarget = null;
                        for (let action of this.game.actions[0]) {
                            if (action.hasLabels(["kill", "mafia"]) && action.dominates()) {
                                killedTarget = action.target;
                                break;
                            }
                        }

                        if (!killedTarget) {
                            return;
                        }

                        this.actor.role.data.cleanedHouse = true;
                        killedTarget.lastWill = null;
                        this.stealAllItems(killedTarget);
                    }
                },
                shouldMeet() {
                    return !this.data.cleanedHouse;
                }
            },
        }
    }
}