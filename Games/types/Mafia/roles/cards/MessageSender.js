const Card = require("../../Card");
const { PRIORITY_MESSAGE_GIVER_DEFAULT } = require("../../const/Priority");

module.exports = class MessageSender extends Card {

    constructor(role) {
        super(role);

        this.meetings = {
            "Write Message": {
                states: ["Night"],
                flags: ["voting"],
                inputType: "text",
                textOptions: {
                    minLength: 1,
                    maxLength: 100,
                    alphaOnly: false,
                    toLowerCase: false,
                    submit: "Write"
                },
                action: {
                    priority: PRIORITY_MESSAGE_GIVER_DEFAULT - 1,
                    run: function () {
                        this.actor.role.data.message = this.target;
                    }
                }
            },

            "Send Message": {
                states: ["Night"],
                flags: ["voting"],
                targets: {include: ["alive"]},
                action: {
                    labels: ["message"],
                    priority: PRIORITY_MESSAGE_GIVER_DEFAULT,
                    run: function () {
                      var alert = this.actor.role.data.message;
                      this.target.queueAlert(alert);		
                    }
                }
            }
        };
    }
}
