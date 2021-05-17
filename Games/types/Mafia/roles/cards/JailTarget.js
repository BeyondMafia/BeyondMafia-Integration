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
						if (this.dominates())
							this.target.holdItem("Handcuffs");
					}
				}
			},
			
		};
	}

}