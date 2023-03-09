const Effect = require("../Effect");
const Action = require("../Action");
const Random = require("../../../../lib/Random");

module.exports = class Infected extends Effect {

    constructor() {
        super("Infected");

        this.listeners = {
            "state": function (stateInfo) {
                if (!this.player.alive)
                    return;

                if (stateInfo.name.match(/Night/) && stateInfo.dayCount % 2 == 1)
                    this.game.stateEvents["Full Moon"] = true;
            },
            "actionsNext": function (actionQueue) {
                if (!this.player.alive)
                    return;

                const stateInfo = this.game.getStateInfo();

                if (!stateInfo.name.match(/Night/) || stateInfo.dayCount % 2 != 1)
                    return;

                const nonMosters = this.game.players.filter(p => p.role.alignment != "Monsters" && p.alive && p != this.player);
                const target = Random.randArrayVal(nonMosters);

                this.game.queueAction(new Action({
                    actor: this.player,
                    target: target,
                    game: this.player.game,
                    labels: ["kill", "infected"],
                    run: function () {
                        if (this.dominates())
                            this.target.kill("basic", this.actor);
                    }
                }));
            }
        };
    }
};
