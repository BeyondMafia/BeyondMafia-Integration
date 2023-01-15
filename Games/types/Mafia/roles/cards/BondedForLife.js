const Card = require("../../Card");
const { PRIORITY_FALL_IN_LOVE } = require("../../const/Priority");

module.exports = class BondedForLife extends Card {

    constructor(role) {
        super(role);

        this.meetings = {
            "Fall in love": {
                states: ["Night"],
                flags: ["voting"],
                action: {
                    priority: PRIORITY_FALL_IN_LOVE,
                    run: function() {
                        this.actor.role.data.loves = this.target;
                        var alert = `You fall deathly in love with ${this.actor.name}.`;
                        this.target.queueAlert(alert);
                    }
                },
                shouldMeet() {
                    return !this.data.loves;
                }

            }
        };

    }

}