const Card = require("../../Card");
const { PRIORITY_NIGHT_SAVEBLOCK } = require("../../const/Priority");

module.exports = class NightSaveBlock extends Card {

	constructor(role) {
		super(role);

		this.meetings = {
			"Save": {
				states: ["Night"],
				flags: ["voting"],
				action: {
					labels: ["save", "block"],
					priority: PRIORITY_NIGHT_SAVEBLOCK,
					run: function () {
            for (let action of this.game.actions[0]) {
							if (
								action.actor == this.target &&
								action.priority > this.priority &&
								!action.hasLabel("absolute")
							) {
								action.cancel(true);
							}
						}
						this.target.setTempImmunity("kill", 1);
					}
				}
			}
		};
	}

}
