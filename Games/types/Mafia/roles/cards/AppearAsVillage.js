const Card = require("../../Card");

module.exports = class AppearAsVillage extends Card {

	constructor(role) {
		super(role);

		this.appearance = {
			self: "Villager"
		};
	}

}
