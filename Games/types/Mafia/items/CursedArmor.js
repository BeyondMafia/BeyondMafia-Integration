const Item = require("../Item");

module.exports = class CursedArmor extends Item {

    constructor() {
        super("Armor (Cursed)");

        this.lifespan = 1;

    }

    hold(player) {
        for (let item of player.items) {
            if (item.name == "Armor") {
                item.drop();
                return;
            }
        }

        super.hold(player);
    }

}