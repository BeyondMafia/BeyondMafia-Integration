const Item = require("../Item");

module.exports = class Match extends Item {

    constructor() {
        super("Match");

        this.meetings = {
            "Light Match": {
                actionName: "Light your match?",
                states: [STATE_DAY],
                flags: [FLAG_VOTING, FLAG_INSTANT, FLAG_NO_VEG],
                inputType: "boolean",
                action: {
                    labels: ["ignite", LABEL_MATCH],
                    item: this,
                    run: function () {
                        if (this.target == "Yes") {
                            this.game.queueAlert(`Someone throws a match into the crowd!`);

                            for (let player of this.game.players) {
                                if (player.hasItem("Gasoline")) {
                                    if (player.alive && this.dominates(player))
                                        player.kill(DEATH_TYPE_BURN, this.actor, true);

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
