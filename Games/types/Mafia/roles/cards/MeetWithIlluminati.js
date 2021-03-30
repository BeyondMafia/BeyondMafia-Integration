const Card = require("../../Card");

module.exports = class MeetWithIlluminati extends Card {

	constructor(role) {
		super(role);

		this.meetings = {
			"Illuminati Meeting": {
				states: ["Night"],
				flags: ["group", "speech"]
			}
		};
	}

}