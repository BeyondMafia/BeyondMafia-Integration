const Card = require("../../Card");

module.exports = class NightRoleBlocker extends Card {

	constructor(role) {
		super(role);

		this.meetings = {
			"Block": {
				states: ["Night"],
				flags: ["voting"],
				action: {
					labels: ["block"],
					priority: -96,
					run: function () {
						for (let action of this.game.actions[0]) {
							if (
								action.actor == this.target &&
								action.priority > this.priority &&
								!action.hasLabel("absolute")
							) {
								action.cancel(true);
							}
						}
					}
				}
			}
		};
	}

}