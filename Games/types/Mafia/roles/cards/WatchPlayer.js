const Card = require("../../Card");
const { PRIORITY_WATCH } = require("../../const/Priority");

module.exports = class WatchPlayer extends Card {

    constructor(role) {
        super(role);

        this.meetings = {
            "Watch": {
                states: ["Night"],
                flags: ["voting"],
                action: {
                    priority: PRIORITY_WATCH,
                    run: function () {
                        var visits = [];

                        for (let action of this.game.actions[0]) {
                            if (
                                action.target == this.target &&
                                !action.hasLabel("hidden") &&
                                action.priority < this.priority
                            ) {
                                visits.push(action.actor.name);
                            }
                        }

                        if (visits.length == 0)
                            visits.push("no one");

                        this.actor.queueAlert(`${this.target.name} was visited by ${visits.join(", ")} during the night.`);
                    }
                }
            }
        };
    }

}