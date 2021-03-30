const Role = require("../../Role");

module.exports = class Escort extends Role {

	constructor(player, data) {
		super("Escort", player, data);

		this.alignment = "Village";
		this.cards = ["VillageCore", "WinWithVillage", "NightRoleBlocker"];
	}

}