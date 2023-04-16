const Card = require("../../Card");
const {PRIORITY_ACTORS_ENQUEUE } = require("../../const/Priority");

module.exports = class Astral extends Card {

    constructor(role) {
        super(role);

        this.actions = [
            {
                priority: PRIORITY_ACTORS_ENQUEUE,
                labels: ["absolute", "hidden"],
                run: function () {
                    if (this.game.getStateName() != "Night")
                        return;

                    for (let action of this.game.actions[0]) {
                        let toCheck = action.actors;
                        if (toCheck.includes(this.player)){
                            action.labels.push("hidden");
                        }
                    }
                }
            }
        ]

    }

}