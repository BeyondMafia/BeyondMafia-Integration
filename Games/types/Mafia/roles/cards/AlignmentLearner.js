const Card = require("../../Card");

module.exports = class AlignmentLearner extends Card {

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
						var role = this.target.getAppearance("investigate", true);
						var alignment = this.game.getRoleAlignment(role);

						if (alignment == "Independent")
							alignment = "neither the Village, Mafia, nor Monsters"
						else 
							alignment = `the ${alignment}`;

						var alert = `You learn that ${this.target.name} is sided with the ${alignment}.`;
						this.game.queueAlert(alert, 0, this.meeting.getPlayers());
					}
				}
			}
		}
	};

}