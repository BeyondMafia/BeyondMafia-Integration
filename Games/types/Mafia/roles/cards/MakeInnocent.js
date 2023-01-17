const Card = require("../../Card");
const { PRIORITY_MAKE_INNOCENT } = require("../../const/Priority");

module.exports = class MakeInnocent extends Card {

    constructor(role) {
        super(role);

        this.meetings = {
            "Make Innocent": {
                states: ["Night"],
                flags: ["voting"],
                targets: { include: ["Mafia"], exclude: ["dead", "self"] },
                action: {
                    priority: PRIORITY_MAKE_INNOCENT,
                    run: function () {
                        this.target.setTempAppearance("investigate", "Villager");
                    }
                }
            }
        };
    }

}