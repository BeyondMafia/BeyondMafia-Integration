const Card = require("../../Card");
const { PRIORITY_MASON_CONVERT, PRIORITY_KILL_DEFAULT } = require("../../const/Priority");

module.exports = class MeetWithMasons extends Card {

    constructor(role) {
        super(role);

        this.meetings = {
            "Masons": {
                actionName: "Convert",
                states: ["Night"],
                flags: ["group", "speech", "voting", "multiActor"],
                targets: { include: ["alive"], exclude: ["Mason"] },
                action: {
                    labels: ["convert", "mason"],
                    priority: PRIORITY_MASON_CONVERT,
                    run: function () {
                        if (this.target.role.name == "Cultist") {
                            this.actor.role.data.masonKills = [this.target];
                            this.actor.role.data.masonKiller = this.actor;
                            return;
                        }

                        if (this.target.role.alignment == "Mafia") {
                            this.actor.role.data.masonKills = this.actors;
                            this.actor.role.data.masonKiller = this.target;
                            return
                        }
                        
                        if (this.dominates()) {
                            this.target.setRole("Mason");
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
                    if (!this.actor.alive)
                        return;

                    if (this.game.getStateName() != "Night")
                        return;

                    let targets = this.actor.role.data.masonKills;
                    if (!targets) {
                        return;
                    }

                    for (let t of targets) {
                        if (this.dominates(t)) {
                            t.kill("basic", this.actor.role.data.masonKiller)
                        }
                    }

                    delete this.actor.role.data.masonKill;
                    delete this.actor.role.data.masonKiller;
                }
            }
        ];
    }

}