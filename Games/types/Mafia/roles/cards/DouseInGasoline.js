const Card = require("../../Card");
const { PRIORITY_ARSONIST } = require("../../const/Priority");

module.exports = class DouseInGasoline extends Card {

	constructor(role) {
		super(role);

		this.meetings = {
			"Douse Villager": {
				states: ["Night"],
				flags: ["voting"],
				action: {
					labels: ["giveItem", "gasoline"],
					priority: PRIORITY_ARSONIST,
					run: function () {
						this.target.holdItem("Gasoline");
					}
				}
			}
		};
	}

}