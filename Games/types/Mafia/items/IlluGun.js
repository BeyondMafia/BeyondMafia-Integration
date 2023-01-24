const Item = require("../Item");

module.exports = class IlluGun extends Item {

    constructor(reveal) {
        super("IlluGun");

        this.reveal = reveal;
        this.meetings = {
            "Shoot Gun": {
                actionName: "Shoot",
                states: ["Day"],
                flags: ["voting", "instant", "noVeg"],
                action: {
                    labels: ["kill", "gun"],
                    item: this,
                    run: function () {
                        if (this.actor.role.data.framed != "")
                            this.game.queueAlert(`${this.actor.role.data.framed} pulls a gun and shoots at ${this.target.name}!`);
                        
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
