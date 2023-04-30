const Card = require("../../Card");
const Random = require("../../../../../lib/Random");
const { PRIORITY_NIGHT_SAVER, PRIORITY_KILL_DEFAULT } = require("../../const/Priority");

module.exports = class NightBodyguard extends Card {

    constructor(role) {
        super(role);

        this.meetings = {
            "Night Bodyguard": {
                actionName: "Save",
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
                        this.actor.role.savedRole = this.target.role.name;
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

                    // target was not attacked
                    let killers = this.actor.role.killers;
                    if (!killers) {
                        return
                    }

                    // fights with attacker, deciding who should die
                    let diesSaving = true;
                    let killsAttacker = true;
                    let killsAllAttackers = true;
                    if (this.actor.role.savedRole != "Celebrity") {
                        diesSaving = Random.randArrayVal([true, false]);
                        killsAttacker = Random.randArrayVal([true, false]);
                        killsAllAttackers = false;
                    }

                    // kill attackers first
                    if (killsAttacker) {
                        let toKill = killsAllAttackers ? killers : [killers[0]];
                        for (let k of toKill) {
                            if (this.dominates(k)) {
                                k.kill("basic", this.actor);
                            }
                        }
                    }

                    // bodyguard did not survive the fight
                    if (diesSaving && this.dominates(this.actor)) {
                        this.actor.kill("basic", killers[0])
                    }
                }
            }
        ];
    }

}