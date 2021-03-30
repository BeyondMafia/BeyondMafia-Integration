const Role = require("../../Role");

module.exports = class Jester extends Role {

	constructor(player, data) {
		super("Jester", player, data);

		this.alignment = "Independent";
		this.winCount = "Village";
		this.cards = ["VillageCore", "WinIfLynched"];
	}

}