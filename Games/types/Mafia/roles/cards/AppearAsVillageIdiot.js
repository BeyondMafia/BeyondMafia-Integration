const Card = require("../../Card");

module.exports = class AppearAsVillageIdiot extends Card {

	constructor(role) {
		super(role);

		this.appearance = {
			self: "Villager"
		};
	}

}
