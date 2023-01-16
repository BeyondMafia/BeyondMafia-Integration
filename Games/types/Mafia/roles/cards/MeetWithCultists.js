const Card = require("../../Card");
const { PRIORITY_CULT_MEETING } = require("../../const/Priority");

module.exports = class MeetWithCultists extends Card {

	constructor(role) {
		super(role);

		this.meetings = {
			"Cultists": {
				actionName: "Convert",
				states: ["Night"],
				flags: ["group", "voting", "multiActor"],
				targets: { include: ["alive"], exclude: ["Monsters"] },
				action: {
					labels: ["convert", "cultist"],
					priority: PRIORITY_CULT_MEETING,
					run: function () {
						if (this.dominates())
							this.target.setRole("Cultist");
					}
				}
			}
		};
	}

}