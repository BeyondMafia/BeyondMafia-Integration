const Card = require("../../Card");
const { EXCLUSIVE_PRIORITY_JAIL } = require("../../const/MeetingExclusivePriority");
const { PRIORITY_JAIL_EXECUTE, PRIORITY_DAY_DEFAULT } = require("../../const/Priority");

module.exports = class JailTarget extends Card {

    constructor(role) {
        super(role);

        this.meetings = {
            "Jail Target": {
                states: ["Day"],
                flags: ["voting"],
                action: {
                    labels: ["jail"],
                    priority: PRIORITY_DAY_DEFAULT,
                    run: function () {
                        if (this.dominates()) {
                            this.target.holdItem("Handcuffs");
                            this.actor.role.data.prisoner = this.target;
                        }
                    }
                }
            },
            "Jail": {
                actionName: "Execute Prisoner",
                states: ["Night"],
                flags: ["exclusive", "group", "speech", "voting", "anonymous"],
                inputType: "boolean",
                leader: true,
                priority: EXCLUSIVE_PRIORITY_JAIL,
                shouldMeet: function () {
                    for (let player of this.game.players)
                        if (player.hasItem("Handcuffs"))
                            return true;

                    return false;
                },
                action: {
                    priority: PRIORITY_JAIL_EXECUTE,
                    run: function () {
                        var prisoner = this.actor.role.data.prisoner;

                        if (!prisoner)
                            return;

                        if (this.target == "Yes")
                            prisoner.kill("basic", this.actor);
                    }
                }
            }
        };
    }

}