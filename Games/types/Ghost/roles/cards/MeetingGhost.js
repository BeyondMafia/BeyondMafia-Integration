const Card = require("../../Card");

module.exports = class MeetingGhost extends Card {

    constructor(role) {
        super(role);

        this.meetings = {
            "Ghost": {
                actionName: "Select Leader",
                states: ["Night"],
                flags: ["group", "speech", "voting", "mustAct"],
                targets: { include: ["alive"] },
                action: {
                    run: function () {
                        this.game.startRoundRobin(this.target);
                    }
                }
            }
        };
    }

}
