const Card = require("../../Card");
const { PRIORITY_KILL_VISITORS_ENQUEUE_DEAD, PRIORITY_KILL_VISITORS } = require("../../const/Priority");

module.exports = class KillVisitorsWhileDead extends Card {

    constructor(role) {
        super(role);

        this.actions = [
            {
                priority: PRIORITY_KILL_VISITORS_ENQUEUE_DEAD,
                run: function () {
                    if (this.actor.alive)
                        return;

                    for (let action of this.game.actions[0])
                        if (
                            action.target == this.actor &&
                            action.priority > this.priority &&
                            !action.hasLabel("hidden")
                        ) {
                            if (!this.actor.role.data.visitors)
                                this.actor.role.data.visitors = [];

                            this.actor.role.data.visitors.push(action.actor);
                        }
                }
            },
            {
                priority: PRIORITY_KILL_VISITORS,
                labels: ["kill", "hidden"],
                run: function () {
                    if (this.actor.alive)
                        return;

                    var visitors = this.actor.role.data.visitors;

                    if (visitors) {
                        for (let visitor of visitors)
                            if (this.dominates(visitor))
                                visitor.kill("basic", this.actor);

                        this.actor.role.data.visitors = [];
                    }

                }
            }
        ];

    }

}