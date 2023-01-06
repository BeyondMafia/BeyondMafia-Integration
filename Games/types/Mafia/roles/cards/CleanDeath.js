const Card = require("../../Card");

module.exports = class CleanDeath extends Card {

	constructor(role) {
		super(role);

		this.meetings = {
			"Clean": {
				states: ["Night"],
				flags: ["voting"],
				action: {
					labels: ["clean"],
					priority: -2,
					run: function () {
						var targetRole = this.target.role;
						var actorRole = this.actor.role;

						if (!targetRole.data.lastCleanedAppearance) {
							var role = this.target.getAppearance("death", true);
							this.actor.queueAlert(`You discover ${this.target.name}'s role is ${role}.`);

							actorRole.data.cleanedPlayer = this.target;
							targetRole.data.lastCleanedAppearance = targetRole.appearance.death;
							targetRole.appearance.death = null;
						}
					}
				},
				shouldMeet() {
					return !this.data.cleanedPlayer;
				}
			}
		};
		this.listeners = {
			"state": function (stateInfo) {
				var target = this.data.cleanedPlayer;

				if (stateInfo.name.match(/Day/) && target && target.role.data.lastCleanedAppearance) {
					target.role.appearance.death = target.role.data.lastCleanedAppearance;
					target.role.data.lastCleanedAppearance = null;
				}
			}
		};
	}

}