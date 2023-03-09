const Card = require("../../Card");
const { PRIORITY_CLEANSE_INFECTED_VISITORS } = require("../../const/Priority");

module.exports = class CleanseInfectedVisitors extends Card {

    constructor(role) {
        super(role);

        this.actions = [
            {
                priority: PRIORITY_CLEANSE_INFECTED_VISITORS,
                labels: ["cleanse", "infected", "hidden"],
                run: function () {
                    if (this.game.getStateName() != "Night")
                        return;

                    var cleansedInfected = {};

                    for (let action of this.game.actions[0]) {
                        if (
                            action.target == this.actor &&
                            action.actor.hasEffect("Infected") &&
                            action.priority > this.priority &&
                            !action.hasLabel("hidden")
                        ) {
                            action.actor.removeEffect("Infected", true);
                            cleansedInfected[action.actor.id] = true;
                        }
                    }

                    if (Object.keys(cleansedInfected).length == 0)
                        return;

                    for (let action of this.game.actions[0]) {
                        if (
                            action.actor &&
                            cleansedInfected[action.actor.id] &&
                            action.hasLabels(["kill", "infected"])
                        ) {
                            action.cancel();
                        }
                    }
                }
            }
        ];
    }

}
