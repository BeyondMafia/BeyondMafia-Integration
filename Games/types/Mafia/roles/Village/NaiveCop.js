const Role = require("../../Role");

module.exports = class NaiveCop extends Role {

	constructor(player, data) {
		super("Naïve Cop", player, data);

		this.alignment = "Village";
		this.cards = ["VillageCore", "WinWithVillage", "AlignmentLearnerNaive", "AppearAsCop"];
	}

}