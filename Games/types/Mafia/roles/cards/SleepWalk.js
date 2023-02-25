const Card = require("../../Card");
const Random = require("../../../../../lib/Random");
const Action = require("../../Action");
const { PRIORITY_SLEEPWALKER } = require("../../const/Priority");

module.exports = class SleepWalk extends Card {

    constructor(role) {
        super(role);

        this.listeners = {
            "state": function (stateInfo) {
                if (!stateInfo.name.match(/Night/)) {
                    return
                }

                const target_list = this.game.players.filter(p => p.alive);
                const target = Random.randArrayVal(target_list);

                var action = new Action({
                    actor: this.player,
                    target: target,
                    game: this.player.game,
                    priority: PRIORITY_SLEEPWALKER,
                    run: function() {}
                })

                this.game.queueAction(action);
            }
        }
    };
}
