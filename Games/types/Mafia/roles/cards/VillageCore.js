const Card = require("../../Card");
const { PRIORITY_VILLAGE } = require("../../const/Priority");

module.exports = class VillageCore extends Card {

    constructor(role) {
        super(role);

        this.meetings = {
            "Village": {
                type: "Village",
                states: ["Day"],
                flags: ["group", "speech", "voting"],
                whileDead: true,
                passiveDead: true,
                action: {
                    labels: ["kill", "lynch", "hidden"],
                    priority: PRIORITY_VILLAGE,
                    power: 3,
                    run: function () {
                        this.game.events.emit("lynch", this.meeting);
                        if (this.dominates())
                            this.target.kill("lynch", this.actor);
                    }
                }
            },
            "Graveyard": {
                states: ["*"],
                flags: ["group", "speech", "liveJoin"],
                whileAlive: false,
                whileDead: true,
                passiveDead: false,
            }
        };
    }

}
