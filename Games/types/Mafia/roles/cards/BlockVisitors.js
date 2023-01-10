const Card = require("../../Card");
const { PRIORITY_BLOCK_VISITORS } = require("../../const/Priority");

module.exports = class BlockVisitors extends Card {

	constructor(role) {
		super(role);

		this.actions = [
			{
				priority: PRIORITY_BLOCK_VISITORS,
				labels: ["block", "hidden"],
				run: function () {
					if (this.game.getStateName() != "Night")
						return;

					for (let action of this.game.actions[0]) {
						if (
							action.target == this.actor &&
							action.priority > this.priority &&
							!action.hasLabel("hidden")
						) {
							action.cancel(true);
						}
					}
				}
			}
		];
	}

}
