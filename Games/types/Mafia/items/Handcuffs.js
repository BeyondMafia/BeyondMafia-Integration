const Item = require("../Item");

module.exports = class Handcuffs extends Item {

    constructor(reveal) {
        super("Gun");

        this.reveal = reveal;
        this.meetings = {
            "Shoot Gun": {
                actionName: "Shoot",
                states: ["Day"],
                flags: ["voting", "instant"],
                action: {
                    labels: ["kill", "gun"],
                    item: this,
                    run: function () {
                        var reveal = this.item.reveal;

                        if (reveal == null)
                            reveal = Random.randArrayVal([true, false]);

                        if (reveal)
                            this.game.queueAlert(`${this.actor.name} pulls a gun and shoots at ${this.target.name}!`);
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