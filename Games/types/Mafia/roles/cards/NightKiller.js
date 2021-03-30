const Card = require("../../Card");

module.exports = class NightKiller extends Card {

	constructor(role) {
		super(role);

		this.meetings = {
			"Solo Kill": {
				actionName: "Kill",
				states: ["Night"],
				flags: ["voting"],
				action: {
					labels: ["kill"],
					priority: 0,
					run: function () {
						if (this.dominates())
							this.target.kill("basic", this.actor);
					}
				}
			}
		};
	}

}