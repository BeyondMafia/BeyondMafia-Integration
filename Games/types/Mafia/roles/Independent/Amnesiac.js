const Role = require("../../Role");

module.exports = class Amnesiac extends Role {

	constructor(player, data) {
		super("Amnesiac", player, data);

		this.alignment = "Independent";
		this.cards = ["VillageCore", "BecomeDeadRole"];
	}

}