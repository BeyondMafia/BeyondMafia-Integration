const Item = require("../Item");

module.exports = class Suit extends Item {

    constructor(type) {
        super("Suit");
        this.type = type;
    }

    hold(player) {
        player.role.appearance.death = this.type;
        player.role.appearance.reveal = this.type;
        player.role.appearance.investigate = this.type;

        super.hold(player);
    }
}