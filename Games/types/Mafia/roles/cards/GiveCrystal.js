const Card = require("../../Card");
const { PRIORITY_ITEM_GIVER_DEFAULT } = require("../../const/Priority");

module.exports = class GiveCrystal extends Card {

    constructor(role) {
        super(role);

        this.meetings = {
            "Give Crystal": {
                states: ["Night"],
                flags: ["voting"],
                action: {
                    labels: ["giveItem", "crystal"],
                    priority: PRIORITY_ITEM_GIVER_DEFAULT,
                    run: function () {
                        this.target.holdItem("Crystal");
                        this.target.queueAlert("You have received a crystal ball!");
                    }
                }
            }
        };
    }

}
