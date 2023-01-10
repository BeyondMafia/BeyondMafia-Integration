const Role = require("../../Role");

module.exports = class Executioner extends Role {

	constructor(player, data) {
		super("Executioner", player, data);

		this.alignment = "Independent";
		this.cards = ["VillageCore", "WinByLynching"];
	}

}