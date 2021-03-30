const Card = require("../../Card");

module.exports = class ArmorGiver extends Card {

	constructor(role) {
		super(role);

		this.meetings = {
			"Give Armor": {
				states: ["Night"],
				flags: ["voting"],
				action: {
					labels: ["giveItem", "armor"],
					priority: -50,
					run: function () {
						this.target.holdItem("Armor");
					}
				}
			}
		};
	}

}
