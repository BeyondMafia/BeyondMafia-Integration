const Card = require("../../Card");
const Random = require("../../../../../lib/Random");
const Action = require("../../Action");
const { PRIORITY_SLEEPWALKER } = require("../../const/Priority");

module.exports = class SleepWalk extends Card {

    constructor(role) {
        super(role);

        this.actions = {
            priority: PRIORITY_SLEEPWALKER,
            target: this.player;
            run: function () {
                if (this.game.getStateName() != "Night")
                    return;
                
                const target_list = this.game.players.filter(p => p != this.player);
                const target = Random.randArrayVal(target_list);
                this.target = target;
        }

        /** this.listeners = {
            "state": function (stateInfo) {
                const target_list = this.game.players.filter(p => p != this.player);
                const target = Random.randArrayVal(target_list);


                if (stateInfo.name.match(/Night/)) {
                    var action = new Action({
                        actor: this.player,
                        target: target,
                        game: this.player.game,
                        priority: PRIORITY_SLEEPWALKER,
                    })
                    }
                } **/
            }
        };
    }
