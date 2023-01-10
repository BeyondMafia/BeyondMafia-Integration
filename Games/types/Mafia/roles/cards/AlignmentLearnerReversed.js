const Card = require("../../Card");
const { PRIORITY_ALIGNMENT_LEARNER } = require("../../const/Priority");

module.exports = class AlignmentLearnerReversed extends Card {

	constructor(role) {
		super(role);

		this.meetings = {
			"Learn Reversed Alignment": {
				actionName: "Learn Alignment",
				states: ["Night"],
				flags: ["voting"],
				action: {
					labels: ["investigate", "alignment"],
					priority: PRIORITY_ALIGNMENT_LEARNER,
					run: function () {
						var role = this.target.getAppearance("investigate", true);
						var alignment = this.game.getRoleAlignment(role);

						if (alignment == "Village" || alignment == "Independent")
							alignment = "Mafia"
						else if (alignment == "Mafia" || alignment == "Monsters")
							alignment = "Village";

						var alert = `You learn that ${this.target.name} is sided with the ${alignment}.`;
						this.game.queueAlert(alert, 0, this.meeting.getPlayers());
					}
				}
			}
		}
	};

}
