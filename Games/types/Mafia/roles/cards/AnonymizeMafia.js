const Card = require("../../Card");

module.exports = class AnonymizeMafia extends Card {

    constructor(role) {
        super(role);

        this.meetingMods = {
            "Mafia": {
                flags: ["group", "speech", "voting", "multiActor", "anonymous"],
                targets: { include: ["alive"], exclude: [] }
            }
        };

        this.listeners = {
            "roleAssigned": function (player) {
                if (player !== this.player) {
                    return;
                }

                for (let player of this.game.players) {
                    player.role.oblivious["Mafia"] = true;
                }
            }
        };

    }

}
