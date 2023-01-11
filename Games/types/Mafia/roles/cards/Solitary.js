const Card = require("../../Card");

module.exports = class Solitary extends Card {

	constructor(role) {
		super(role);

		this.meetingMods = {
			"Illuminati Meeting": {
				disabled: true
			},
			"Learn Alignment": {
				flags: ["voting"],
			},
		};
	}

}
