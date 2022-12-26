const Card = require("../../Card");

module.exports = class MeetWithMasons extends Card {

	constructor(role) {
		super(role);

		this.meetings = {
			"Hot Springs": {
				actionName: "Enjoy the hot springs",
				states: ["Night"],
				flags: ["group", "speech", "voting", "anonymous"],
				inputType: "boolean"
			}
		};
	}

}