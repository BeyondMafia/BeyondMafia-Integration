const Card = require("../../Card");
const { PRIORITY_INFECT } = require("../../const/Priority");

module.exports = class InfectPlayer extends Card {

    constructor(role) {
        super(role);

        this.meetings = {
            "Infect Player": {
                states: ["Night"],
                flags: ["voting"],
                targets: { include: ["alive"], exclude: ["Monsters"] },
                action: {
                    labels: ["infected"],
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
