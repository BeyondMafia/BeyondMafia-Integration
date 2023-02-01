const Card = require("../../Card");

module.exports = class GuessAdversaryKill extends Card {

    constructor(role) {
        super(role);

        this.meetings = {
            "Guess Adversary": {
                states: ["Night"],
                flags: ["voting"],
                action: {
                    labels: ["kill"],
                    run: function () {
                        if (this.target.role.name != this.actor.role.roleToGuess) {
                            this.cancel();
                            return;
                        }

                        if (this.dominates())
                            this.target.kill("basic", this.actor);
                    }
                }
            }
        }
    }

}