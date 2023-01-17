const Card = require("../../Card");

module.exports = class KnowSpies extends Card {

    constructor(role) {
        super(role);

        this.listeners = {
            "start": function() {
                if (this.oblivious["Spies"])
                    return;

                for (let player of this.game.players) {
                    if (
                        player.role.alignment == "Spies" &&
                        player != this.player &&
                        !player.role.oblivious["self"]
                    ) {
                        this.revealToPlayer(player);
                    }
                }
            }
        };
    }

}