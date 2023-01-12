  const Item = require("../Item");

    module.exports = class Match extends Item {

        constructor(reveal) {
            super("Match");

            this.reveal = reveal;
            this.meetings = {
                "Light Match": {
                    actionName: "Light your match?",
                    states: ["Day"],
                    flags: ["voting", "instant", "noVeg"],
                    inputType: "boolean",
                    action: {
                        labels: ["ignite", "match"],
                        item: this,
                        run: function () {
                            if (this.target == "Yes") {
                                this.game.queueAlert(`Someone throws a match into the crowd!`);
                                for (let player of this.game.players) {
                                    const isDoused = player.hasItem("Gasoline");

                                    if (player.alive && isDoused) {
                                         if (this.dominates(player))    
                                            player.kill("burn", this.actor, true);
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