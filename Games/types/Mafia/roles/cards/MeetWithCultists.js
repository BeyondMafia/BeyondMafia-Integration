const Card = require("../../Card");

module.exports = class MeetWithCultists extends Card {

	constructor(role) {
		super(role);

		this.meetings = {
			"Cultists": {
				actionName: "Convert",
				states: ["Night"],
				flags: ["group", "speech", "voting"],
				targets: { include: ["alive"], exclude: ["Cultist"] },
				action: {
					labels: ["convert", "cultist"],
					priority: -2,
					run: function () {
						if (this.dominates())
							this.target.setRole("Cultist");
					}
				}
			}
		};
	}

}