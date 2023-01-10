const Item = require("../Item");
const Random = require("../../../../lib/Random");

module.exports = class AssoGun extends Item {

    constructor() {
        super("AssoGun");

        this.meetings = {
            "Shoot Gun": {
                actionName: "Shoot",
                states: ["Day"],
                flags: ["voting", "instant", "noVeg"],
                action: {
                    labels: ["kill", "gun"],
                    item: this,
                    run: function () {
                        this.game.queueAlert(`${this.actor.name} pulls a gun and shoots at ${this.target.name}!`);

                        if (this.dominates()) {
                            if (this.target.role.alignment !== "Mafia") {
                                this.target.kill("gun", this.actor, true);
                            }
                        }

                        this.item.drop();
                        this.game.broadcast("gunshot");
                    }
                }
            }
        };
    }

}