const Card = require("../../Card");

module.exports = class CatGiver extends Card {

	constructor(role) {
		super(role);

		this.meetings = {
			"Give Cat": {
				states: ["Day"],
				flags: ["voting", "instant", "noVeg"],
				action: {
					labels: ["giveItem", "cat"],
					run: function () {
						this.target.holdItem("Cat");
						this.target.queueAlert("You have received a cat!");
						this.target.data.catLady = this.actor;
					}
				}
			}
		};
	}

}
