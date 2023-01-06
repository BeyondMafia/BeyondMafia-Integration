const Card = require("../../Card");

module.exports = class MeetWithMasons extends Card {

	constructor(role) {
		super(role);

		this.meetings = {
			"Masons": {
				actionName: "Convert",
				states: ["Night"],
				flags: ["group", "speech", "voting"],
				targets: { include: ["alive"], exclude: ["Mason"] },
				action: {
					labels: ["convert", "mason"],
					priority: -2,
					run: function () {
						if (this.target.role.alignment != "Mafia" && this.dominates())
							this.target.setRole("Mason");
					}
				}
			}
		};
	}

}