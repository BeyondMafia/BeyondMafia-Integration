const Role = require("../../Role");

module.exports = class Cultist extends Role {

	constructor(player, data) {
		super("Cultist", player, data);

		this.alignment = "Independent";
		this.cards = [
			"VillageCore", 
			"WinAllSameRole", 
			"MeetWithCultists", 
			"KillSameRoleOnDeath"
		];
		this.winCount = "Cultist";
	}

}