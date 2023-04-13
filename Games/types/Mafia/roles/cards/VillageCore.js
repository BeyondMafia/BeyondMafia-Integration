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
                speakDead: true,
                action: {
                    labels: ["kill", "lynch", "hidden"],
                    priority: PRIORITY_VILLAGE,
                    power: 3,
                    run: function () {
                        if (this.dominates())
                            this.target.kill("lynch", this.actor);
                    }
                }
            },
            "Village ": {
                states: ["Night"],
                flags: ["group", "speech", "liveJoin"],
                whileAlive: false,
                whileDead: true,
                passiveDead: false,
                speakDead: true
            }
        };
    }

    speak(message) {
        message.modified = true;
        if (!message.sender.alive) {
            message.recipients = message.game.players.filter(x => !x.alive);
        }
    }

}
