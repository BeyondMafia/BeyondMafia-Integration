const Card = require("../../Card");
const { PRIORITY_GUN_GIVER } = require("../../const/Priority");

module.exports = class GunGiver extends Card {

    constructor(role) {
        super(role);

        this.meetings = {
            "Give Gun": {
                states: ["Night"],
                flags: ["voting"],
                action: {
                    labels: ["giveItem", "gun"],
                    priority: PRIORITY_GUN_GIVER,
                    run: function () {
                        this.target.holdItem("Gun");
                        this.target.queueAlert("You have received a gun!");
                    }
                }
            }
        };
    }

}
