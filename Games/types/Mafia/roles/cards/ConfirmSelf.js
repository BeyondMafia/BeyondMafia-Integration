const Card = require("../../Card");
const { PRIORITY_CONFIRM_SELF } = require("../../const/Priority");

module.exports = class ConfirmSelf extends Card {

    constructor(role) {
        super(role);

        this.meetings = {
            "Reveal Identity": {
                states: ["Night"],
                flags: ["voting"],
                action: {
                    labels: ["investigate", "role"],
                    priority: PRIORITY_CONFIRM_SELF,
                    run: function () {
                        var role = this.actor.getAppearance("investigate", true);
                        var alert = `You learn that ${this.actor.name}'s role is ${role}.`;
                        this.target.queueAlert(alert);
                    }
                }
            }
        };
    }

}
