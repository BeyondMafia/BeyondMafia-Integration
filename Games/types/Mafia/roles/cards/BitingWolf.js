const Card = require("../../Card");

module.exports = class BitingWolf extends Card {

	constructor(role) {
		super(role);

		this.meetings = {
			"Wolf Bite": {
				states: ["Night"],
				flags: ["voting"],
				targets: { include: ["alive"], exclude: ["Monsters"] },
				action: {
					labels: ["wolfBite"],
					priority: -50,
					run: function () {
						if (this.dominates()) {
							this.target.giveEffect("Werewolf");
						}
					}
				}
			}
		};
	}

}