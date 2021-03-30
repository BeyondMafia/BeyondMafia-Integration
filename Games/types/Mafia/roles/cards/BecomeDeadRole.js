const Card = require("../../Card");

module.exports = class BecomeDeadRole extends Card {

	constructor(role) {
		super(role);

		this.meetings = {
			"Become Role": {
				states: ["Night"],
				flags: ["voting"],
				targets: { include: ["dead"], exclude: [""]},
				action: {
					priority: 50,
					run: function () {
						this.actor.setRole(`${this.target.role.name}:${this.target.role.modifier}`);
					}
				}
			}
		};
	}

}