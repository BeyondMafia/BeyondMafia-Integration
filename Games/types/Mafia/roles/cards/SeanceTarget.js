const Card = require("../../Card");
const {PRIORITY_JAIL_MEETING } = require("../../const/Priority");

module.exports = class SeanceTarget extends Card {

    constructor(role) {
        super(role);

        this.meetings = {
            "Seance Player": {
                states: ["Day"],
                flags: ["voting"],
                targets: { include: ["dead"], exclude: ["alive", "self"] },
                action: {
                    labels: ["jail"],
                    priority: PRIORITY_JAIL_MEETING,
                    run: function () {
                        if (this.dominates()) {
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
                action: {
                    priority: PRIORITY_JAIL_MEETING,
                    run: function () {
                    }
                }
            }
        };
    }

}