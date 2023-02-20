const Card = require("../../Card");
const { PRIORITY_NIGHT_TRAPPER } = require("../../const/Priority");

module.exports = class NightTrapper extends Card {

    constructor(role) {
        super(role);

        this.meetings = {
            "Trap": {
                states: ["Night"],
                flags: ["voting"],
                action: {
                    labels: ["kill", "trap"],
                    priority: PRIORITY_NIGHT_TRAPPER,
                    run: function () {
                        this.trapTarget();
                    }
                }
            }
        };
    }

}
