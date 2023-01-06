const Card = require("../../Card");

module.exports = class TrackPlayer extends Card {

	constructor(role) {
		super(role);

		this.meetings = {
			"Track": {
				states: ["Night"],
				flags: ["voting"],
				action: {
					priority: 100,
					run: function () {
						var visits = [];
						
						for (let action of this.game.actions[0]) {
							if (
								action.actor == this.target &&
								!action.hasLabel("hidden") &&
								action.priority < this.priority
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