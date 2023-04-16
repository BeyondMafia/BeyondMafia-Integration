const Effect = require("../Effect");
const Action = require("../Action");
const { PRIORITY_UNTARGETABLE } = require("../const/Priority");

module.exports = class Untargetable extends Effect {

    constructor() {
        super("Untargetable");
    }

    apply(player) {
        super.apply(player);

        this.action = new Action({
            actor: player,
            target: player,
            game: player.game,
            priority: PRIORITY_UNTARGETABLE,
            run: function () {
                this.makeUntargetable();
                this.blockActions();
            }
        });

        this.game.queueAction(this.action);
    }
}