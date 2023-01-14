const Role = require("../../Role");

module.exports = class Disguiser extends Role {

	constructor(player, data) {
		super("Disguiser", player, data);

		this.alignment = "Mafia";
		this.cards = ["VillageCore", "WinWithMafia", "MeetingMafia", "IdentityStealer"];
		this.meetingMods = {
			"Mafia": {
				leader: true,
			}
		};
	}

}