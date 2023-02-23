const Card = require("../../Card");

module.exports = class FoolAround extends Card {

    constructor(role) {
        super(role);

        this.meetings = {
            "Fool Around": {
                states: ["Night"],
                flags: ["voting", "noVeg"],
                action: {
                    run: function () {}
                },
            }
        };
    }

}