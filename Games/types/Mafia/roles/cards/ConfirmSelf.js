const Card = require("../../Card");
const { PRIORITY_CONFIRM_SELF } = require("../../const/Priority");

module.exports = class ConfirmSelf extends Card {

	constructor(role) {
		super(role);

		this.meetings = {
			"Reveal Identity": {
				states: ["Night"],
				flags: ["voting"],
				action: {
					labels: ["confirmSelf"],
					priority: PRIORITY_CONFIRM_SELF,
					run: function () {
            var role = this.target.getAppearance("investigate", true);
						this.target.queueAlert("You learn that ${this.actor.name} is the ${role}.");
					}
				}
			}
		};
	}

}
