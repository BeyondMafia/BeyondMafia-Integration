const Card = require("../../Card");

module.exports = class ElectionResults extends Card {

    constructor(role) {
        super(role);

        this.listeners = {
            "rolesAssigned": function (player) {
                if (player && player !== this.player) {
                    return;
                }

                this.game.queueAlert(`${this.player.name} has been elected ${this.player.role.name}!`, 0, this.game.players.filter(p => p.role.alignment === "Village"));
            }
        };
    }
}
