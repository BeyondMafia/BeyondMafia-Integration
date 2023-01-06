const Card = require("../../Card");

module.exports = class CanProbe extends Card {
	
	constructor(role) {
		super(role);
		
		this.meetings = {
			"Probe":{
				actionName: "Probe",
				states: ["Night"],
				flags: ["voting"],
				action: {
					labels: ["effect", "probe"],
					priority: 0,
					run: function () {
						this.target.giveEffect("Probe", this.actor);
					}
				}
			}
		}
	}
}