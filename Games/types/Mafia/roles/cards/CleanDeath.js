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
						var actorRole = this.target.role;

						if (!targetRole.data.lastCleanedAppearance) {
							actorRole.data.cleanedPlayer = this.target;
							targetRole.data.lastCleanedAppearance = targetRole.appearance.death;
							targetRole.appearance.death = null;
						}
					}
				}
			}
		};
		this.listeners = {
			"state": function (stateInfo) {
				var target = this.data.cleanedPlayer;

				if (stateInfo.name.match(/Day/) && target && target.role.data.lastCleanedAppearance) {
					target.role.appearance.death = target.role.data.lastCleanedAppearance;
					this.data.cleanedPlayer = null;
					target.role.data.lastCleanedAppearance = null;
				}
			}
		};
	}

}