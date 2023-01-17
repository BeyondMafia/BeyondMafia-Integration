const Item = require("../Item");
const Random = require("../../../../lib/Random");

module.exports = class CursedKnife extends Item {

    constructor(reveal) {
        super("Knife (Cursed)");

        this.reveal = reveal;
        this.meetings = {
            "Stab Knife": {
                actionName: "Stab",
                states: ["Day"],
                flags: ["voting", "instant", "noVeg"],
                action: {
                    labels: ["stab"],
                    item: this,
                    run: function() {
                        this.target = this.actor;
                        var reveal = this.item.reveal;

                        if (reveal == null)
                            reveal = Random.randArrayVal([true, false]);

                        if (reveal)
                            this.game.queueAlert(`${this.actor.name} nicks themself with a poisoned knife!`);
                        else
                            this.game.queueAlert(`Someone stabs ${this.target.name} with a poisoned knife!`);

                        this.target.giveEffect("Poison", this.actor);

                        this.item.drop();
                    }
                }
            }
        };
    }


}
