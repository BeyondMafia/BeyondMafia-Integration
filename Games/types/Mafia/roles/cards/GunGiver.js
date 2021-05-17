const Card = require("../../Card");

module.exports = class GunGiver extends Card {

	constructor(role) {
		super(role);

		this.meetings = {
			"Give Gun": {
				states: ["Night"],
				flags: ["voting"],
				action: {
					labels: ["giveItem", "gun"],
					priority: -50,
					run: function () {
						this.target.holdItem("Gun");
						this.target.queueAlert("You have received a gun!");
					}
				}
			}
		};
	}

}
