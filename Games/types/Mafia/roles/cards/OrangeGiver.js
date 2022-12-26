const Card = require("../../Card");

module.exports = class OrangeGiver extends Card {

	constructor(role) {
		super(role);

		this.meetings = {
			"Give Orange": {
				states: ["Night"],
				flags: ["voting"],
				action: {
					labels: ["giveItem", "orange"],
					priority: -50,
					run: function () {
						this.target.holdItem("Orange");
						this.target.queueAlert("You have received a yuzu orange!");
					}
				}
			}
		};
	}

}
