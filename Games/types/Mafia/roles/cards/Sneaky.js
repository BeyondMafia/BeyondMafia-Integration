const Card = require("../../Card");

module.exports = class Sneaky extends Card {

    constructor(role) {
        super(role);

        this.listeners = {
            "meeting": function(meeting) {
                if (meeting.members[this.player.id]) {
                    var options = meeting.members[this.player.id].originalOptions
                    if (options.action) {
                        options.action.labels.push("hidden");
                    }
                }
            }
        }
    };
}