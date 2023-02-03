const Card = require("../../Card");
const { PRIORITY_ITEM_GIVER_DEFAULT } = require("../../const/Priority");

module.exports = class GiveVisitorsGuns extends Card {

    constructor(role) {
        super(role);

        this.actions = [
            {
                priority: PRIORITY_ITEM_GIVER_DEFAULT,
                labels: ["giveItem", "gun"],
                run: function () {
                    if (this.game.getStateName() == "Night") {
                        for (let action of this.game.actions[0]) {
                            if (action.target == this.actor && !action.hasLabel("hidden")) {
                                action.actor.holdItem("Gun");
                                action.actor.queueAlert("You have received a gun!");
                            }
                        }
                    }
                }
            }
        ];
    }

}