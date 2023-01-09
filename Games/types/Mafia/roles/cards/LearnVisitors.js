const Card = require("../../Card");
const { PRIORITY_LEARN_VISITORS_ENQUEUE, PRIORITY_LEARN_VISITORS } = require("../../const/Priority");

module.exports = class KillVisitors extends Card {

	constructor(role) {
		super(role);

		this.actions = [
			{
				priority: PRIORITY_LEARN_VISITORS_ENQUEUE,
				run: function () {
					if (this.game.getStateName() != "Night")
						return;

					for (let action of this.game.actions[0])
						if (
							action.target == this.actor && 
							action.priority > this.priority &&
							!action.hasLabel("hidden")
						) {
							if (!this.actor.role.data.visitors)
								this.actor.role.data.visitors = [];

							this.actor.role.data.visitors.push(action.actor);
						}
				}
			},
			{
				priority: PRIORITY_LEARN_VISITORS,
				labels: ["investigate", "role", "hidden"],
				run: function () {
					if (this.game.getStateName() != "Night")
						return;

					var visitors = this.actor.role.data.visitors;

					if (visitors) {
						for (let visitor of visitors)
							var role = this.target.getAppearance("investigate", true);
              var alert = `You learn that ${this.target.name}'s role is ${role}.`;
              this.actor.queueAlert(alert);

						this.actor.role.data.visitors = [];
					}

				}
			}
		];		
	}

}
