const Card = require("../../Card");

module.exports = class PublicReveal extends Card {

    constructor(role) {
        super(role);

        this.listeners = {
            "rolesAssigned": function (player) {
                if (player && player != this.player) {
                    return;
                }
                
                this.data.revealed = true;
                this.revealToAll();
            }
        };
    }

}