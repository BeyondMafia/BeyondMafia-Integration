const Card = require("../../Card");
const { PRIORITY_CURSE } = require("../../const/Priority");

module.exports = class CurseWithWord extends Card {

	constructor(role) {
		super(role);

		this.meetings = {
			"Curse": {
				states: ["Night"],
				flags: ["voting"],
				targets: { include: ["alive"], exclude: ["Mafia"] },
				action: {
					labels: ["effect", "cursed"],
					priority: PRIORITY_CURSE,
					run: function () {
						this.target.giveEffect("Cursed", this.actor, "word", 1);
					}
				}
			}
		};
	}

}
