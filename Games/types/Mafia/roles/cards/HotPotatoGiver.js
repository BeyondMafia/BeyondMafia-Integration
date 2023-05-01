const Card = require("../../Card");
const { PRIORITY_ITEM_GIVER_DEFAULT } = require("../../const/Priority");

module.exports = class HotPotatoGiver extends Card {

    constructor(role) {
        super(role);

        this.meetings = {
            "Give Hot Potato": {
                states: ["Night"],
                flags: ["voting"],
                targets: { include: ["alive"] },
                action: {
                    labels: ["giveItem", "bomb"],
                    priority: PRIORITY_ITEM_GIVER_DEFAULT,
                    run: function () {
                        this.target.holdItem("HotPotato", this.actor);
                        this.queueGetItemAlert("HotPotato");
                    }
                }
            }
        };
    }

}
