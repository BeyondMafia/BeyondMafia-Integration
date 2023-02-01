const Card = require("../../Card");
const { PRIORITY_INVESTIGATIVE_DEFAULT } = require("../../const/Priority");

module.exports = class TrackPlayer extends Card {

    constructor(role) {
        super(role);

        this.meetings = {
            "Track": {
                states: ["Night"],
                flags: ["voting"],
                action: {
                    priority: PRIORITY_INVESTIGATIVE_DEFAULT,
                    run: function () {
                        var visits = [];

                        for (let action of this.game.actions[0]) {
                            if (
                                action.actors.indexOf(this.target) != -1 &&
                                !action.hasLabel("hidden") &&
                                action.target
                            ) {
                                visits.push(action.target.name);
                            }
                        }

                        if (visits.length == 0)
                            visits.push("no one");

                        this.actor.queueAlert(`${this.target.name} visited ${visits.join(", ")} during the night.`);
                    }
                }
            }
        };
    }

}