const Card = require("../../Card");
const { PRIORITY_LYNCH_REVENGE } = require("../../const/Priority");

module.exports = class LynchRevenge extends Card {

    constructor(role) {
        super(role);

        this.meetings = {
            "Get Revenge": {
                states: ["Sunset"],
                flags: ["voting"],
                shouldMeet: function () {
                    for (let action of this.game.actions[0])
                        if (action.target == this.player && action.hasLabel("lynch"))
                            return true;

                    return false;
                },
                action: {
                    labels: ["kill"],
                    priority: PRIORITY_LYNCH_REVENGE,
                    run: function () {
                        if (this.dominates())
                            this.target.kill("lynchRevenge", this.actor);
                    }
                }
            }
        };
        this.stateMods = {
            "Day": {
                type: "delayActions",
                delayActions: true
            },
            "Overturn": {
                type: "delayActions",
                delayActions: true
            },
            "Sunset": {
                type: "add",
                index: 5,
                length: 1000 * 30,
                shouldSkip: function () {
                    for (let action of this.game.actions[0])
                        if (action.target == this.player && action.hasLabel("lynch"))
                            return false;

                    return true;
                }
            }
        };
    }

}