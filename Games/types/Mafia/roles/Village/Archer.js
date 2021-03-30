const Role = require("../../Role");

module.exports = class Archer extends Role {

	constructor(player, data) {
		super("Archer", player, data);

		this.alignment = "Village";
		this.cards = ["VillageCore", "WinWithVillage", "LynchRevenge"];
	}

}