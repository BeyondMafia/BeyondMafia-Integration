const Card = require("../../Card");
const { PRIORITY_NIGHT_TRAPPER } = require("../../const/Priority");

module.exports = class NightSurgeon extends Card {

    constructor(role) {
        super(role);

        this.meetings = {
            "Surgeon": {
                states: ["Night"],
                flags: ["voting"],
                action: {
                    labels: ["save", "kill"],
                    priority: PRIORITY_NIGHT_TRAPPER,
                    run: function () {
                        this.trapTarget();
                        this.healTarget(1);
                    }
                }
            }
        };
    }

}
