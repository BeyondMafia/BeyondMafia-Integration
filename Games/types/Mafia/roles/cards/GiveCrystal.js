const Card = require("../../Card");
const { PRIORITY_ITEM_GIVER_DEFAULT } = require("../../const/Priority");

module.exports = class GiveCrystal extends Card {

    constructor(role) {
        super(role);

        this.meetings = {
            "Give Crystal": {
                states: ["Night"],
                flags: ["voting"],
                shouldMeet: function() {
                    return !this.data.crystalGiven;
                },
                action: {
                    labels: ["giveItem", "crystal"],
                    priority: PRIORITY_ITEM_GIVER_DEFAULT,
                    run: function () {
                        this.target.holdItem("Crystal");
                        this.target.queueAlert(":sy1i: You have received a crystal ball!");
                        this.actor.role.data.crystalGiven = true;
                    },
                },
            }
        };
    }

}
