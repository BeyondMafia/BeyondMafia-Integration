const Card = require("../../Card");
const { PRIORITY_MASON_CONVERT } = require("../../const/Priority");

module.exports = class MeetWithMasons extends Card {

	constructor(role) {
		super(role);

		this.meetings = {
			"Masons": {
				actionName: "Convert",
				states: ["Night"],
				flags: ["group", "speech", "voting", "multiActor"],
				targets: { include: ["alive"], exclude: ["Mason"] },
				action: {
					labels: ["convert", "mason"],
					priority: PRIORITY_MASON_CONVERT,
					run: function () {
						if (this.target.role.alignment != "Mafia" && this.dominates())
							this.target.setRole("Mason");
					}
				}
			}
		};
	}

}