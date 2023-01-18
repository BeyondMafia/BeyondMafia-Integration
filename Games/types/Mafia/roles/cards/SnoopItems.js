const Card = require("../../Card");
const { PRIORITY_INVESTIGATIVE_AFTER_RESOLVE_DEFAULT } = require("../../const/Priority");

module.exports = class SnoopItems extends Card {

    constructor(role) {
        super(role);

        this.meetings = {
            "Snoop": {
                states: ["Night"],
                flags: ["voting"],
                action: {
                    priority: PRIORITY_INVESTIGATIVE_AFTER_RESOLVE_DEFAULT,
                    run: function() {
                        let items = this.target.items.map(a => a.name);
                        let alert = `You snoop on ${this.target.name}during the night and find they are carrying`
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