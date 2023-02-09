const Card = require("../../Card");
const { PRIORITY_ITEM_GIVER_DEFAULT } = require("../../const/Priority");
const { EXCLUSIVE_PRIORITY_HOT_SPRINGS } = require("../../const/MeetingExclusivePriority");

module.exports = class OrangeGiver extends Card {

    constructor(role) {
        super(role);

        this.meetings = {
            "Hot Springs": {
                states: ["Night"],
                flags: ["exclusive", "group", "speech", "anonymous"],
                priority: EXCLUSIVE_PRIORITY_HOT_SPRINGS,
            },

            "Give Orange": {
                states: ["Night"],
                flags: ["voting"],
                priority: EXCLUSIVE_PRIORITY_HOT_SPRINGS + 1,
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
