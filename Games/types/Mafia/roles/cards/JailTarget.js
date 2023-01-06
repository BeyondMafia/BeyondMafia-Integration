const Card = require("../../Card");

module.exports = class JailTarget extends Card {

	constructor(role) {
		super(role);

		this.meetings = {
			"Jail Target": {
				states: ["Day"],
				flags: ["voting"],
				action: {
					labels: ["jail"],
					priority: -10,
					run: function () {
						if (this.dominates()) {
							this.target.holdItem("Handcuffs");
							this.actor.role.data.prisoner = this.target;
						}
					}
				}
			},
			"Jail": {
				actionName: "Execute Prisoner",
				states: ["Night"],
				flags: ["group", "speech", "voting", "anonymous"],
				inputType: "boolean",
				leader: true,
				shouldMeet: function () {
					for (let player of this.game.players)
						if (player.hasItem("Handcuffs"))
							return true;

					return false;
				},
				action: {
					priority: 0,
					run: function () {
						var prisoner = this.actor.role.data.prisoner;

						if (!prisoner)
							return;

						if (this.target == "Yes")
							prisoner.kill("basic", this.actor);
					}
				}
			}
		};
	}

}