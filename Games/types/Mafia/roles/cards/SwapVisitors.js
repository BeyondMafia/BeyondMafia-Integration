const Card = require("../../Card");

module.exports = class SwapVisitors extends Card {

	constructor(role) {
		super(role);

		this.meetings = {
			"Destination A": {
				states: ["Night"],
				flags: ["voting"],
				targets: { include: ["alive"], exclude: [""] },
				action: {
					priority: -98,
					run: function () {
						this.actor.role.data.destinationA = this.target;
					}
				}
			},
			"Destination B": {
				states: ["Night"],
				flags: ["voting"],
				targets: { include: ["alive"], exclude: [""] },
				action: {
					priority: -97,
					run: function () {
						var destinationA = this.actor.role.data.destinationA;
						var destinationB = this.target;

						for (let action of this.game.actions[0]) {
							if (action.priority > this.priority) {
								if (action.target == destinationA)
									action.target = destinationB;
								else if (action.target == destinationB)
									action.target = destinationA;
							}

						}

						delete this.actor.role.data.destinationA;
						delete this.actor.role.data.destinationB;
					}
				}
			}
		};
	}

}