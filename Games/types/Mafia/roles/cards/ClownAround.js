const Card = require("../../Card");
const { PRIORITY_NIGHT_KILLER } = require("../../const/Priority");

module.exports = class ClownAround extends Card {

    constructor(role) {
        super(role);

        this.appearance = {
            self: "Jester"
        };

        this.meetings = {
            "Fool Around": {
                states: ["Night"],
                flags: ["voting", "noVeg"],
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