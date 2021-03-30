const Card = require("../../Card");

module.exports = class KillVoteOnLynch extends Card {

	constructor(role) {
		super(role);

		this.listeners = {
			"actionsNext": function () {
				if (this.game.getStateName() != "Day")
					return;

				var wasLynched = false;
				var lynchMeeting;

				for (let action of this.game.actions[0]) {
					if (action.target == this.player && action.hasLabel("lynch")) {
						wasLynched = true;
						lynchMeeting = action.meeting;
						break;
					}
				}

				if (!wasLynched)
					return;

				var target = this.game.getPlayer(lynchMeeting.votes[this.player.id]);

				if (!target)
					return;

				this.game.queueAction(new Action({
					actor: this.player,
					target: target,
					labels: ["kill"],
					run: function () {
						if (this.dominates())
							this.target.kill("basic", this.actor);
					}
				}));
			}
		};
	}

}