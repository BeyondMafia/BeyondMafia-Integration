const Card = require("../../Card");
const { PRIORITY_INFECT } = require("../../const/Priority");

module.exports = class Infect extends Card {

    constructor(role) {
        super(role);

        this.meetings = {
            "Infect": {
                states: ["Night"],
                flags: ["voting"],
                targets: { include: ["alive"], exclude: ["Monsters"] },
                action: {
                    labels: ["infect"],
                    priority: PRIORITY_INFECT,
                    run: function () {
                        if (this.dominates()) {
                            this.target.giveEffect("Infected");
                        }
                    }
                }
            }
        };
    }

}
