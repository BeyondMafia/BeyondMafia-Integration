const Card = require("../../Card");
const Random = require("../../../../../lib/Random");
const { PRIORITY_NIGHT_SAVER, PRIORITY_KILL_DEFAULT } = require("../../const/Priority");

module.exports = class NightBodyguard extends Card {

    constructor(role) {
        super(role);

        this.meetings = {
            "Save": {
                states: ["Night"],
                flags: ["voting"],
                action: {
                    labels: ["save"],
                    priority: PRIORITY_NIGHT_SAVER,
                    run: function () {
                        this.heal(1);

                        let killers = this.getVisitors(this.target, "kill");
                        if (killers.length == 0) {
                            return;
                        }

                        this.actor.role.killers = killers;
                        this.actor.role.willDieSaving = true;
                        this.actor.role.willKillAttacker = true;
                        this.actor.role.willKillAllAttackers = true;

                        if (this.target.role.name != "Mayor") {
                            this.actor.role.willDieSaving = Random.randArrayVal([true, false]);
                            this.actor.role.willKillAttacker = Random.randArrayVal([true, false]);
                            this.actor.role.willKillAllAttackers = false;
                        }
                    }
                }
            }
        };

        this.actions = [
            {
                priority: PRIORITY_KILL_DEFAULT,
                labels: ["kill", "hidden", "absolute"],
                run: function () {
                    if (this.game.getStateName() != "Night")
                        return;

                    // kill attackers first
                    let shouldKill = this.actor.role.willKillAttacker;
                    if (!shouldKill) {
                        return
                    }
                    let toKill = this.actor.role.killers;
                    if (!this.actor.role.willKillAllAttackers) {
                        toKill = [killers[0]];
                    }

                    for (let k of toKill) {
                        if (this.dominates(k)) {
                            k.kill("basic", this.actor);
                        }
                    }

                    // die during the save
                    let dieDuringSave = this.actor.role.willDieSaving;
                    if (!dieDuringSave) {
                        return;
                    }

                    if (this.dominates(this.actor)) {
                        this.actor.kill("basic", toKill[0])
                    }
                }
            }
        ];
    }

}