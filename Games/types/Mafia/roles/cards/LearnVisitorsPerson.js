const Card = require("../../Card");
const { PRIORITY_INVESTIGATIVE_DEFAULT } = require("../../const/Priority");

module.exports = class LearnVisitors extends Card {

    constructor(role) {
        super(role);

        this.actions = [
            {
                priority: PRIORITY_INVESTIGATIVE_DEFAULT,
                labels: ["investigate", "role", "hidden", "absolute"],
                run: function () {
                    if (this.game.getStateName() != "Night")
                        return;

                    for (let action of this.game.actions[0]) {
                        if (
                            action.target == this.actor &&
                            !action.hasLabel("hidden")
                        ) {
                            let visitors = this.getVisitors(this.player);
                            let visitorNames = visitors.map(player => player.name);
                            if (visitorNames.length === 0) {;
                                visitorNames.push("no one");
                            }
                        }
                    }
                    this.actor.queueAlert(`:sy0f: You were visited by ${visitorNames.join(", ")} during the night.`);
                }
            }
        ];
    }

}
