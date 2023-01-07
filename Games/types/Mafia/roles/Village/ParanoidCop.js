const Role = require("../../Role");

module.exports = class ParanoidCop extends Role {

	constructor(player, data) {
		super("Paranoid Cop", player, data);

		this.alignment = "Village";
		this.cards = ["VillageCore", "WinWithVillage", "AlignmentLearnerParanoid", "AppearAsCop"];
		this.meetingMods = {
			"Learn Alignment": {
				flags: ["voting", "group"],
				targets: { include: ["alive"], exclude: ["members"] },
			}
		};
	}

}