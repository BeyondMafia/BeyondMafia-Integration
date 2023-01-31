const Item = require("../Item");
const Random = require("../../../../lib/Random");

module.exports = class Snowball extends Item {

    constructor(reveal) {
        super("Snowball");

        this.reveal = reveal;
        this.meetings = {
            "Throw Snowball": {
                actionName: "Throw",
                states: ["Day"],
                flags: ["voting", "instant", "noVeg"],
                action: {
                    labels: ["throw"],
                    item: this,
                    run: function() {
                        var reveal = this.item.reveal;

                        if (reveal == null)
                            reveal = Random.randArrayVal([true, false]);

                        if (reveal)
                            this.game.queueAlert(`${this.actor.name} pulls out a snowball, it hits ${this.target.name} in the face!`);
                        else
                            this.game.queueAlert(`Someone throws a snowball at ${this.target.name}!`);

                        if (this.dominates())
                            this.target.giveEffect("Stun", this.actor);

                        this.item.drop();
                    }
                }
            }
        };
    }


}