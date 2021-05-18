const Role = require("../../Role");

module.exports = class Telepath extends Role {

	constructor(player, data) {
		super("Telepath", player, data);

		this.alignment = "Mafia";
		this.cards = ["VillageCore", "WinWithMafia", "MeetingMafia", "ContactByRole"];
	}

}