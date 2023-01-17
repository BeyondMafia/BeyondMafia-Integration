const Card = require("../../Card");
const { PRIORITY_NIGHT_KILLER } = require("../../const/Priority");

module.exports = class NightKiller extends Card {

    constructor(role) {
        super(role);

        this.meetings = {
            "Solo Kill": {
                actionName: "Kill",
                states: ["Night"],
                flags: ["voting"],
                action: {
                    labels: ["kill"],
                    priority: PRIORITY_NIGHT_KILLER,
                    run: function () {
                        if (this.dominates())
                            this.target.kill("basic", this.actor);
                    }
                }
            }
        };
    }

}