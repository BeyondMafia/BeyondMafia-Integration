const Card = require("../../Card");

module.exports = class GiveVisitorsGuns extends Card {

	constructor(role) {
		super(role);

		this.actions = [
			{
				priority: 100,
				labels: ["giveItem", "gun"],
				run: function () {
					if (this.game.getStateName() == "Night") {
						for (let action of this.game.actions[0]) {
							if (action.target == this.actor && !action.hasLabel("hidden")) {
								action.actor.holdItem("Gun");
								action.actor.queueAlert("You have received a gun!");
							}
						}
					}
				}
			}
		];
	}

}