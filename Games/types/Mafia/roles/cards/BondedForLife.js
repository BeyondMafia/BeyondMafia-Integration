const Card = require("../../Card");
const { PRIORITY_MESSAGE_GIVER_DEFAULT } = require("../../const/Priority");

module.exports = class BondedForLife extends Card {

    constructor(role) {
        super(role);

        this.meetings = {
            "Fall in love": {
                states: ["Night"],
                flags: ["voting"],
                action: {
                    priority: PRIORITY_MESSAGE_GIVER_DEFAULT,
                    run: function() {
                        this.actor.role.data.loves = this.target;
                        let targetAlert = `:sy3g: You fall deathly in love with ${this.actor.name}.`;
                        this.target.queueAlert(targetAlert);

                        let actorAlert = `:sy3g: You fall deathly in love with ${this.target.name}.`;
                        this.actor.queueAlert(actorAlert);
                    }
                },
                shouldMeet() {
                    return !this.data.loves;
                }

            }
        };

    }

}