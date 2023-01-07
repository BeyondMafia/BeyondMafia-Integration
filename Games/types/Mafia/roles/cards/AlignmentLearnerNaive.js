const Card = require("../../Card");

module.exports = class AlignmentLearnerNaive extends Card {

	constructor(role) {
		super(role);

		this.meetings = {
			"Learn Alignment": {
				states: ["Night"],
				flags: ["voting"],
				action: {
					labels: ["investigate", "alignment"],
					priority: -10,
					run: function () {
						var alert = `You learn that ${this.target.name} is sided with the Village.`;
						this.game.queueAlert(alert, 0, this.meeting.getPlayers());
					}
				}
			}
		}
	};

}