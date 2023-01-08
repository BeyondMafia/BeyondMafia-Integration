const Card = require("../../Card");
const { PRIORITY_VILLAGE_MEETING } = require("../../const/Priority");

module.exports = class VillageCore extends Card {

	constructor(role) {
		super(role);

		this.meetings = {
			"Village": {
				type: "Village",
				states: ["Day"],
				whileDead: true,
				passiveDead: true,
				action: {
					labels: ["kill", "lynch", "hidden"],
					priority: PRIORITY_VILLAGE_MEETING,
					power: 3,
					run: function () {
						if (this.dominates())
							this.target.kill("lynch", this.actor);
					}
				}
			},
			"Graveyard": {
				states: ["*"],
				flags: ["group", "speech", "liveJoin"],
				whileAlive: false,
				whileDead: true,
				passiveDead: false,
			}
		};
	}

}
