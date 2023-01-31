const Card = require("../../Card");
const { PRIORITY_ITEM_GIVER_DEFAULT } = require("../../const/Priority");

module.exports = class OrangeGiver extends Card {

    constructor(role) {
        super(role);

        this.meetings = {
            "Give Orange": {
                states: ["Night"],
                flags: ["voting"],
                action: {
                    labels: ["giveItem", "orange"],
                    priority: PRIORITY_ITEM_GIVER_DEFAULT,
                    run: function () {
                        this.target.holdItem("Orange");
                        this.target.queueAlert("You have received a yuzu orange!");
                    }
                }
            }
        };
    }

}
