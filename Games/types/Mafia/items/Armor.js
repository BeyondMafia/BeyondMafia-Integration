const Item = require("../Item");

module.exports = class Armor extends Item {

    constructor() {
        super("Armor");

        this.uses = 1;
        this.effects = ["Kill Immune"];
        this.listeners = {
            "immune": function (action) {
                if (
                    action.target == this.holder &&
                    action.hasLabel("kill") &&
                    !this.holder.role.immunity["kill"] &&
                    !this.holder.tempImmunity["kill"]
                ) {
                    for (let effect of this.holder.effects)
                        if (effect.immunity["kill"] && effect.name != "Kill Immune")
                            return;

                    this.uses--;

                    if (this.uses <= 0)
                        this.drop();
                }
            }
        };
    }

    hold(player) {
        for (let effect of player.effects) {
            if (effect.name == "Armor") {
                effect.uses++;
                return;
            }
        }

        super.hold(player);
    }

}
