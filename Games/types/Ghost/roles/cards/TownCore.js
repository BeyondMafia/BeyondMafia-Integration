const Card = require("../../Card");

module.exports = class TownCore extends Card {

    constructor(role) {
        super(role);

        this.meetings = {
            "Village": {
                type: "Village",
                states: ["Day"],
                flags: ["group", "speech", "voting"],
                whileDead: true,
                action: {
                    run: function () {
                        this.target.kill("lynch");
                    }
                }
            }
        };
    }

}
