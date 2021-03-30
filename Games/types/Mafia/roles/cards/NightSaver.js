const Card = require("../../Card");

module.exports = class NightSaver extends Card {

	constructor(role) {
		super(role);

		this.meetings = {
			"Save": {
				states: ["Night"],
				flags: ["voting"],
				action: {
					labels: ["save"],
					priority: -94,
					run: function () {
						this.target.setTempImmunity("kill", 1);
					}
				}
			}
		};
	}

}