const Card = require("../../Card");
const { PRIORITY_NIGHT_DRAINER } = require("../../const/Priority");

module.exports = class LeechBlood extends Card {

    constructor(role) {
        super(role);

        this.meetings = {
            "Leech": {
                states: ["Night"],
                flags: ["voting"],
                action: {
                    labels: ["block", "blood"],
                    priority: PRIORITY_NIGHT_DRAINER,
                    run: function () {
                        this.target.data.blood -= 50;
                        this.player.data.blood += 50;
                    }
                },
            }
        };
    }
}