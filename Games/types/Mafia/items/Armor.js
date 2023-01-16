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
                    action.hasLabel(LABEL_KILL) &&
                    !this.holder.role.immunity[LABEL_KILL] &&
                    !this.holder.tempImmunity[LABEL_KILL]
                ) {
                    for (let effect of this.holder.effects)
                        if (effect.immunity[LABEL_KILL] && effect.name != "Kill Immune")
                            return;

                    this.uses--;
                    this.holder.queueAlert("Shattering to pieces, your armor saves your life!");

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
