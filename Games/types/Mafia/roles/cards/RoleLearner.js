const Card = require("../../Card");

module.exports = class RoleLearner extends Card {

	constructor(role) {
		super(role);

		this.meetings = {
			"Learn Role": {
				states: ["Night"],
				flags: ["voting"],
				action: {
					labels: ["investigate", "role"],
					priority: -10,
					run: function () {
						var role = this.target.getAppearance("investigate", true);
						var alert = `You learn that ${this.target.name}'s role is ${role}.`;
						this.actor.queueAlert(alert);
					}
				}
			}
		};
	}

}