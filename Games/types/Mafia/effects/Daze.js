const Effect = require("../Effect");
const Action = require("../Action");
const { PRIORITY_NIGHT_ROLE_BLOCKER } = require("../const/Priority");

module.exports = class Daze extends Effect {

    constructor(dazer) {
        super("Daze");
        this.dazer = dazer;
    }

    apply(player) {
        super.apply(player);

        this.action = new Action({
            actor: this.dazer,
            target: player,
            labels: ["block"],
            priority: PRIORITY_NIGHT_ROLE_BLOCKER,
            effect: this,
            game: this.game,
            run: function() {
                for (let action of this.game.actions[0]) {
                    if (
                        action.actor == this.holder &&
                        action.priority > this.priority &&
                        !action.hasLabel("absolute")
                    ) {
                        action.cancel(true);
                    }
                }
                this.effect.remove();
            }
        });

        this.game.queueAction(this.action);
    }

    remove() {
        super.remove();
        this.action.cancel();
    }

}
