const Role = require("../../Role");

module.exports = class Bee extends Role {

	constructor(player, data) {
		super("Killer Bee", player, data);
		this.alignment = "Mafia";
		this.cards = ["VillageCore", "WinWithMafia", "MeetingMafia", "KillTargetSelf"];
	}

}
