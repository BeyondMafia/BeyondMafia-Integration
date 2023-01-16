const Item = require("../Item");

module.exports = class Snowball extends Item {

    constructor() {
        super("Snowball");

        this.meetings = {
            "Throw Snowball": {
                actionName: "Throw",
                states: ["Day"],
                flags: ["voting", "instant", "noVeg"],
                action: {
                    labels: ["block"],
                    item: this,
                    run: function () {
                        var reveal = this.item.reveal;

                        if (reveal == null)
                            reveal = Random.randArrayVal([true, false]);

                        if (reveal)
                            this.game.queueAlert(`${this.actor.name} pulls out a snowball, it hits in ${this.target} the face!`);
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
