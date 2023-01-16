const Item = require("../Item");

module.exports = class CursedArmor extends Item {

    constructor() {
        super("Armor (Cursed)");

        this.lifespan = 1;

    }

    hold(player) {
        for (let effect of player.effects) {
            if (effect.name == "Armor") {
                effect.uses = 0;
                return;
            }
        }

        super.hold(player);
    }

}
