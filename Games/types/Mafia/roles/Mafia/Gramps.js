const Role = require("../../Role");

module.exports = class Babushka extends Role {

	constructor(player, data) {
		super("Mafioso", player, data);
		this.alignment = "Mafia";
		this.cards = ["VillageCore", "WinWithMafia", "MeetingMafia", "KillImmune", "LearnVisitors"];
	}

}
