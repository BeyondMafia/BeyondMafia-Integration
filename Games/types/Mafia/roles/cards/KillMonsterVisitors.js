const Card = require("../../Card");
const { PRIORITY_KILL_MONSTER_VISITORS_ENQUEUE, PRIORITY_KILL_MONSTER_VISITORS } = require("../../const/Priority");

module.exports = class KillMonsterVisitors extends Card {

    constructor(role) {
        super(role);

        // Store visitors before triggering kills since killing modifies visitor behavior
        this.actions = [
            {
                priority: PRIORITY_KILL_MONSTER_VISITORS_ENQUEUE,
                run: function () {
                    if (this.game.getStateName() != "Night")
                        return;

                    for (let action of this.game.actions[0])
                        if (
                            action.target == this.actor &&
                            action.actor.role.name == "Vampire" &&
                            action.priority > this.priority &&
                            !action.hasLabel("hidden")
                        ) {
                            if (!this.actor.role.data.monsterVisitors)
                                this.actor.role.data.monsterVisitors = [];

                            this.actor.role.data.monsterVisitors.push(action.actor);
                        }
                        if (
                            action.target == this.actor &&
                            action.actor.role.name == "Werewolf" &&
                            action.priority > this.priority &&
                            !action.hasLabel("hidden")
                        ) {
                            if (!this.actor.role.data.monsterVisitors)
                                this.actor.role.data.monsterVisitors = [];

                            this.actor.role.data.monsterVisitors.push(action.actor);
                        }
                }
            },
            {
                priority: PRIORITY_KILL_MONSTER_VISITORS,
                power: 2,
                labels: ["kill", "hidden"],
                run: function () {
                    if (this.game.getStateName() != "Night")
                        return;

                    var monsterVisitors = this.actor.role.data.monsterVisitors;

                    if (monsterVisitors) {
                        for (let visitor of monsterVisitors)
                            if (this.dominates(visitor))
                                visitor.kill("basic", this.actor);

                        this.actor.role.data.monsterVisitors = [];
                    }

                }
            }
        ];
    }
}
