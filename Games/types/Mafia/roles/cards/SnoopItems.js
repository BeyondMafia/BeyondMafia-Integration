const Card = require("../../Card");
const { PRIORITY_SNOOP } = require("../../const/Priority");

module.exports = class TrackPlayer extends Card {

    constructor(role) {
        super(role);

        this.meetings = {
            "Snoop": {
                states: ["Night"],
                flags: ["voting"],
                action: {
                    priority: PRIORITY_SNOOP,
                    run: function() {
                        var items = this.target.items.map(a => a.name);
                        var alert = `You snoop on ${this.target.name}during the night and find they are carrying`
                        if (items.length) {
                            alert += `: ${items.join(", ")}.`
                        } else {
                            alert += ' nothing.';
                        }
                        this.actor.queueAlert(alert);
                    }
                }
            }
        };
    }

}