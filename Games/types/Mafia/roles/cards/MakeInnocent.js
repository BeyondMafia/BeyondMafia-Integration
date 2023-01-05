const Card = require("../../Card");

module.exports = class MakeInnocent extends Card {

	constructor(role) {
		super(role);

		this.meetings = {
			"Make Innocent": {
				states: ["Night"],
				flags: ["voting"],
				targets: { include: ["Mafia"], exclude: ["dead", "self"] },
				action: {
					priority: -50,
					run: function () {
						this.target.setTempAppearance("investigate", "Villager");
					}
				}
			}
		};
	}

}