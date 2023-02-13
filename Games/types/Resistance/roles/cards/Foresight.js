const Card = require("../../Card");

module.exports = class Foresight extends Card {

    constructor(role) {
        super(role);

        this.listeners = {
            "start": function() {
                for (let player of this.game.players) {
                    if (player.role.appearance["merlin"]) {
                        this.revealToPlayer(player, false, "merlin");
                    }
                }
            }
        };
    }

}