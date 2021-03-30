const Role = require("../../Role");

module.exports = class Agent extends Role {

	constructor(player, data) {
		super("Agent", player, data);

		this.alignment = "Village";
		this.cards = ["VillageCore", "WinWithVillage", "GuessAdversaryKill"];
		this.roleToGuess = "Spy";
		this.meetingMods = {
			"Guess Adversary": {
				actionName: "Guess Spy"
			}
		};
	}

}