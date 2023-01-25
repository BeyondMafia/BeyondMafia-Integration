const Item = require("../Item");
const Random = require("../../../../lib/Random");

module.exports = class CursedGun extends Item {

    constructor(reveal) {
        super("Gun (Cursed)");

        this.reveal = reveal;
        this.meetings = {
            "Shoot Gun": {
                actionName: "Shoot",
                states: ["Day"],
                flags: ["voting", "instant", "noVeg"],
                action: {
                    labels: ["kill", "gun"],
                    item: this,
                    run: function() {
                        this.target = this.actor;
                        var reveal = this.item.reveal;

                        if (reveal == null)
                            reveal = Random.randArrayVal([true, false]);

                        if (reveal)
                            this.game.queueAlert(`${this.actor.name} pulls a gun, it backfires!`);
                        else
                            this.game.queueAlert(`Someone fires a gun at ${this.target.name}!`);

                        if (this.dominates())
                            this.target.kill("gun", this.actor, true);

                        this.item.drop();
                        this.game.broadcast("gunshot");
                    }
                }
            }
        };
    }

}