const Card = require("../../Card");
const { PRIORITY_NIGHT_ROLE_BLOCKER } = require("../../const/Priority");

module.exports = class Friendly extends Card {

    constructor(role) {
        super(role);

        this.actions = [
            {
                priority: PRIORITY_NIGHT_ROLE_BLOCKER,
                labels: ["block", "hidden"],
                run: function () {
                    if (this.game.getStateName() != "Night")
                        return;

                    var visiting = this.actor.role.data.visiting;

                    if (visiting) {
                        for (let visited of visiting)
                            if (this.dominates(visited))
                                visited.blockActions();

                        this.actor.role.data.visiting = [];
                    }
                }
            }
        ];
    }

}