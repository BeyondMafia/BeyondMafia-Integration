const Card = require("../../Card");
const { PRIORITY_BLOCK_VISITORS_ENQUEUE, PRIORITY_LEARN_VISITORS } = require("../../const/Priority");

module.exports = class KillVisitors extends Card {

	constructor(role) {
		super(role);

		this.actions = [
			{
				priority: PRIORITY_BLOCK_VISITORS_ENQUEUE,
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
				priority: PRIORITY_BLOCK_VISITORS,
				labels: ["block", "hidden"],
				run: function () {
					if (this.game.getStateName() != "Night")
						return;

					var visitors = this.actor.role.data.visitors;

					if (visitors) {
						for (let visitor of visitors)
							for (let action of this.game.actions[0]) {
							if (
								action.actor == this.target &&
								action.priority > this.priority &&
								!action.hasLabel("absolute")
							) {
								action.cancel(true);
							}
						}

						this.actor.role.data.visitors = [];
					}

				}
			}
		];		
	}

}
