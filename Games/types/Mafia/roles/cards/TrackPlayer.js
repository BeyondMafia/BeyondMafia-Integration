const Card = require("../../Card");
const { PRIORITY_TRACK } = require("../../const/Priority");

module.exports = class TrackPlayer extends Card {

	constructor(role) {
		super(role);

		this.meetings = {
			"Track": {
				states: ["Night"],
				flags: ["voting"],
				action: {
					priority: PRIORITY_TRACK,
					run: function () {
						var visits = [];

						for (let action of this.game.actions[0]) {
							if (
								action.actor == this.target &&
								!action.hasLabel("hidden") &&
								action.priority < this.priority &&
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