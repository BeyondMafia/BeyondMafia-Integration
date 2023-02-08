const Card = require("../../Card");
const {PRIORITY_VISITORS_ENQUEUE } = require("../../const/Priority");

module.exports = class EnqueueVisitors extends Card{
    constructor(role){
        super(role);
        this.actions = [
            {
                priority: PRIORITY_VISITORS_ENQUEUE,
                labels: ["absolute"],
                run: function () {
                    if (this.game.getStateName() != "Night")
                        return;

                    for (let action of this.game.actions[0])
                        if (
                            action.target == this.actor &&
                            !action.hasLabel("hidden")
                        ) {
                            if (!this.actor.role.data.visitors)
                                this.actor.role.data.visitors = [];

                            this.actor.role.data.visitors.push(action.actor);
                        }
                }
            }
        ]
    }
}