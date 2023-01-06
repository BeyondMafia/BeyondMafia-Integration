const Card = require("../../Card");
const { PRIORITY_MAFIA_MEETING } = require("../../const/Priority");

module.exports = class MeetingMafia extends Card {

	constructor(role) {
		super(role);

		this.meetings = {
			"Mafia": {
				actionName: "Mafia Kill",
				states: ["Night"],
				flags: ["group", "speech", "voting"],
				targets: { include: ["alive"], exclude: ["Mafia"] },
				action: {
					labels: ["kill", "mafia"],
					priority: PRIORITY_MAFIA_MEETING,
					run: function () {
						if (this.dominates())
							this.target.kill("basic", this.actor);
					}
				}
			}
		};
	}

}
