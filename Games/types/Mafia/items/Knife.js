const Item = require("../Item");
const Random = require("../../../../lib/Random");

module.exports = class Knife extends Item {

    constructor(reveal) {
        super("Knife");

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
                        var reveal = this.item.reveal;

                        if (reveal == null)
                            reveal = Random.randArrayVal([true, false]);

                        if (reveal)
                            this.game.queueAlert(`${this.actor.name} stabs ${this.target.name} with a posioned knife!`);
                        else
                            this.game.queueAlert(`Someone stabs ${this.target.name} with a posioned knife!`);

                        this.target.giveEffect("Poison", this.actor);

                        this.item.drop();
                    }
                }
            }
        };
    }


}