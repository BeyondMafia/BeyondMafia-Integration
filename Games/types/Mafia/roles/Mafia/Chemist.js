const Role = require("../../Role");

module.exports = class Chemist extends Role {

	constructor(player, data) {
		super("Chemist", player, data);

		this.alignment = "Mafia";
		this.cards = ["VillageCore", "WinWithMafia", "MeetingMafia", "Poisoner"];
	}

}