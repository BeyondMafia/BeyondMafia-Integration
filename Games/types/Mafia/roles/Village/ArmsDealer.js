const Role = require("../../Role");

module.exports = class ArmsDealer extends Role {

	constructor(player, data) {
		super("Arms Dealer", player, data);
		this.alignment = "Village";
		this.cards = ["VillageCore", "WinWithVillage", "GunGiver"];
	}

}
