const Item = require("../Item");

module.exports = class CursedSnowball extends Item {

    constructor() {
        super("Snowball (Cursed)");

        this.meetings = {
            "Throw Snowball": {
                actionName: "Throw",
                states: ["Day"],
                flags: ["voting", "instant", "noVeg"],
                action: {
                    labels: ["block"],
                    item: this,
                    run: function () {
                        this.target = this.actor;
                        var reveal = this.item.reveal;

                        if (reveal == null)
                            reveal = Random.randArrayVal([true, false]);

                        if (reveal)
                            this.game.queueAlert(`${this.actor.name} pulls out a snowball, it explodes in their hand!`);
                        else
                            this.game.queueAlert(`Someone throws a snowball at ${this.target.name}!`);

                        if (this.dominates())
                            this.target.giveEffect("Stun", actor);

                        this.item.drop();
                    }
                }
            }
        };
    }


}
