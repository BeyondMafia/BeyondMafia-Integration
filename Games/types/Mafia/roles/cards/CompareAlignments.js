const Card = require("../../Card");
const { PRIORITY_ALIGNMENT_TARGET_A, PRIORITY_ALIGNMENT_TARGET_B } = require("../../const/Priority");

module.exports = class CompareAlignments extends Card {

	constructor(role) {
		super(role);

		this.meetings = {
			"Alignment Target A": {
				states: ["Night"],
				flags: ["voting"],
				action: {
					labels: ["investigate", "alignment"],
					priority: PRIORITY_ALIGNMENT_TARGET_A,
					run: function () {
						this.actor.role.data.targetA = this.target;

					}
				}
			},
			"Alignment Target B": {
				states: ["Night"],
				flags: ["voting"],
				action: {
					labels: ["investigate", "alignment"],
					priority: PRIORITY_ALIGNMENT_TARGET_B,
					run: function () {

						var targetA = this.actor.role.data.targetA;
						var roleA = targetA.getAppearance("investigate", true);
						var alignmentA = this.game.getRoleAlignment(roleA);

						var targetB = this.target
						var roleB = targetB.getAppearance("investigate", true);
						var alignmentB = this.game.getRoleAlignment(roleB);

						var comparison;

						if (alignmentA == alignmentB)
							comparison = "the same alignment";
						else
							comparison = "different alignments";

						var alert = `You learn that ${targetA.name} and ${targetB.name} have ${comparison}!`;
						this.game.queueAlert(alert, 0, this.meeting.getPlayers());
					}
				}
			}
		};
	}

}