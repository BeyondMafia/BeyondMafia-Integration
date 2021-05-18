const Role = require("../../Role");

module.exports = class Telepath extends Role {

	constructor(player, data) {
		super("Telepath", player, data);

		this.alignment = "Mafia";
		this.cards = ["VillageCore", "WinWithMafia", "MeetingMafia", "ContactByRole"];
		this.meetingMods = {
			"Village": {
				speechAbilities: [{
					name: "Contact",
					targetsDescription: { include: ["all"], exclude: ["self"] },
					targetType: "role",
					verb: ""
				}]
			}
		};
	}

}