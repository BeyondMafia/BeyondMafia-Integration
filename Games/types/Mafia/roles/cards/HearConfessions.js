const Card = require("../../Card");
const { PRIORITY_LEARN_VISITORS } = require("../../const/Priority");

module.exports = class HearConfessions extends Card {

    constructor(role) {
        super(role);

        this.actions = [
            {
                priority: PRIORITY_LEARN_VISITORS,
                labels: ["learn", "role", "hidden", "absolute"],
                run: function () {
                    if (this.game.getStateName() !== "Night")
                        return;

                    for (let action of this.game.actions[0]) {
                        if (
                                action.target === this.actor &&
                            !action.hasLabel("hidden")
                            ) {
                            let role = action.actor.role.name;
                            let alert = `At the confessional last night, a ${role} visited you to confess their sins.`;
                            this.actor.queueAlert(alert);
                        }
                    }
                }
            }
        ];
    }

}
