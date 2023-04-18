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
                                let targets = action.target;
                                if (!Array.isArray(action.target)) {
                                    targets = [action.target];
                                }

                                let targetNames = targets.map(p => p.name);
                                visits.push(...targetNames);
                            }
                        }

                        if (visits.length == 0)
                            visits.push("no one");

                        this.actor.queueAlert(`:sy0g: ${this.target.name} visited ${visits.join(", ")} during the night.`);
                    }
                }
            }
        };
    }

}