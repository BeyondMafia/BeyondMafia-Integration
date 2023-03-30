const Card = require("../../Card");
const { PRIORITY_EFFECT_GIVER_DEFAULT } = require("../../const/Priority");

module.exports = class GiveVisitorsGuns extends Card {

    constructor(role) {
        super(role);

        this.actions = [
            {
                priority: PRIORITY_EFFECT_GIVER_DEFAULT,
                labels: ["giveItem", "gun"],
                run: function () {
                    if (this.game.getStateName() == "Night") {
                        for (let action of this.game.actions[0]) {
                            if (action.target == this.actor && !action.hasLabel("hidden")) {
                                action.actor.holdItem("Gun");
                                action.actor.queueAlert(":sy2h: You have received a gun!");
                            }
                        }
                    }
                }
            }
        ];
    }

}