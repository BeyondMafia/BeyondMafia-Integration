const Card = require("../../Card");
const { PRIORITY_MAKE_GUILTY } = require("../../const/Priority");

module.exports = class MakeGuilty extends Card {

    constructor(role) {
        super(role);

        this.meetings = {
            "Make Guilty": {
                states: ["Night"],
                flags: ["voting"],
                targets: { include: ["alive"], exclude: ["self"] },
                action: {
                    priority: PRIORITY_MAKE_GUILTY,
                    run: function () {
                        this.target.setTempAppearance("investigate", "Mafia");
                    }
                }
            }
        };
    }

}