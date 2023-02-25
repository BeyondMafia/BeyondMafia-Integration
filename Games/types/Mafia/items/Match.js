const Item = require("../Item");

module.exports = class Match extends Item {

    constructor() {
        super("Match");
        this.cannotBeStolen = true;
        this.meetings = {
            "Light Match": {
                actionName: "Light your match?",
                states: ["Day"],
                flags: ["voting", "instant", "noVeg"],
                inputType: "boolean",
                action: {
                    labels: ["kill", "ignite", "match"],
                    item: this,
                    run: function () {
                        if (this.target == "Yes") {
                            this.game.queueAlert(`Someone throws a match into the crowd!`);

                            for (let player of this.game.players) {
                                if (player.hasItem("Gasoline")) {
                                    if (player.alive && this.dominates(player))
                                        player.kill("burn", this.actor, true);

                                    player.dropItem("Gasoline", true);
                                }
                            }

                            this.item.drop();
                        }
                    }
                }
            }
        };

    }
}