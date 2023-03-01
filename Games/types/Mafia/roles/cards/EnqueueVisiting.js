const Card = require("../../Card");
const {PRIORITY_VISITORS_ENQUEUE } = require("../../const/Priority");

module.exports = class EnqueueVisiting extends Card {
    
    constructor(role){
        super(role);

        this.actions = [
            {
                priority: PRIORITY_VISITORS_ENQUEUE - 3,
                labels: ["absolute"],
                run: function () {
                    this.actor.role.data.visiting = [];
                    if (this.game.getStateName() != "Night")
                        return;

                    for (let action of this.game.actions[0])
                        if (
                            action.actor == this.actor &&
                            !action.hasLabel("hidden")
                        ) {
                            if (!this.actor.role.data.visiting)
                                this.actor.role.data.visiting = [];

                            this.actor.role.data.visiting.push(action);
                        }
                }
            }
        ]
    }
}