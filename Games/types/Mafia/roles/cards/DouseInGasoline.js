const Card = require("../../Card");
const { PRIORITY_DOUSE } = require("../../const/Priority");

module.exports = class DouseInGasoline extends Card {

    constructor(role) {
        super(role);

        this.meetings = {
            "Douse Player": {
                states: ["Night"],
                flags: ["voting"],
                action: {
                    labels: ["giveItem", "gasoline"],
                    priority: PRIORITY_DOUSE,
                    run: function () {
                        this.target.holdItem("Gasoline");
                    }
                }
            }
        };
    }

}
