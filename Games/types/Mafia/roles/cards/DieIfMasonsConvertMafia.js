const Card = require("../../Card");
const { PRIORITY_MISMASON_MAFIA } = require("../../const/Priority");

module.exports = class DieIfMasonsConvertMafia extends Card {

    constructor(role) {
        super(role);

        this.actions = [
            {
                labels: ["kill", "mismason"],
                priority: PRIORITY_MISMASON_MAFIA,
                run: function () {
                    if (this.game.getStateName() != "Night")
                        return;

                    for (let action of this.game.actions[0]) {
                        if (
                            action.hasLabels(["convert", "mason"]) &&
                            action.target &&
                            action.target.role.alignment == "Mafia"
                        ) {
                            if (this.dominates(this.actor)) {
                                this.actor.kill("basic");
                                return;
                            }
                        }
                    }
                }
            }
        ];
    }

}