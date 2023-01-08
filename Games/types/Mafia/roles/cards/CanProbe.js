const Card = require("../../Card");
const { PRIORITY_PROBE } = require("../../const/Priority");

module.exports = class CanProbe extends Card {

	constructor(role) {
		super(role);

		this.meetings = {
			"Probe": {
				actionName: "Probe",
				states: ["Night"],
				flags: ["voting"],
				action: {
					labels: ["effect", "probe"],
					priority: PRIORITY_PROBE,
					run: function () {
						this.target.giveEffect("Probe", this.actor);
					}
				}
			}
		}
	}
}
