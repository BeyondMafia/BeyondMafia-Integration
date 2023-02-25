const Card = require("../../Card");
const {PRIORITY_DAY_DEFAULT } = require("../../const/Priority");

module.exports = class SeanceTarget extends Card {

    constructor(role) {
        super(role);

        this.actor.role.data.seancename = null;
        this.meetings = {
            "Seance Player": {
                states: ["Day"],
                flags: ["voting", "exclusive"],
                targets: { include: ["dead"], exclude: ["alive", "self"] },
                action: {
                    labels: ["seance"],
                    priority: PRIORITY_DAY_DEFAULT,
                    run: function () {
                        if (this.dominates()) {
                            this.actor.role.data.seanced = this.target.name;
                            this.actor.role.data.meetingname = "Seance with " + this.target.name;
                            this.target.holdItem("Summon");
                        }
                    }
                }
            },
            "Seance": {
                actionName: "End Seance",
                states: ["Night"],
                flags: ["group", "speech", "voting", "anonymous", "mustAct"],
                inputType: "boolean",
                leader: true,
                shouldMeet: function () {
                    for (let player of this.game.players)
                        if (player.hasItem("Summon"))
                            return true;

                    return false;
                },
            }
        };
    }

}