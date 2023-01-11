const Role = require("../../Role");

module.exports = class Exploder extends Role {

	constructor(player, data) {
		super("Exploder", player, data);
		this.alignment = "Mafia";
		this.cards = ["VillageCore", "WinWithMafia", "MeetingMafia", "Explode"];
	}

}
