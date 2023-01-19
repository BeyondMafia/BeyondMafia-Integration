const Card = require("../../Card");
const { PRIORITY_EFFECT_GIVER_DEFAULT } = require("../../const/Priority");

module.exports = class CurseWithWord extends Card {

	constructor(role) {
		super(role);

		this.meetings = {
			"Curse": {
				states: ["Night"],
				flags: ["voting"],
				targets: { include: ["alive"], exclude: ["Mafia"] },
				action: {
					labels: ["effect"],
					priority: PRIORITY_EFFECT_GIVER_DEFAULT,
					run: function () {
						if (this.dominates() && this.role.data.cursedWord != "") 
							this.target.giveEffect("Cursed", this.actor, "why", 1);		
					}
				}
			}
		};
	}
}
