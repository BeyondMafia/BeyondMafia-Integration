const Card = require("../../Card");

module.exports = class Visit extends Card {

    constructor(role) {
        super(role);

        this.meetings = {
            "Visit": {
                states: ["Night"],
                flags: ["voting", "noVeg"],
                action: {
                    run: function () {}
                },
            }
        };
    }

}
