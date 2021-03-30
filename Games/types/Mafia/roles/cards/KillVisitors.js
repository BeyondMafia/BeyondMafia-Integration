const Card = require("../../Card");

module.exports = class KillVisitors extends Card {

	constructor(role) {
		super(role);

		this.actions = [
			{
				priority: -95,
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
				priority: 0,
				labels: ["kill", "hidden"],
				run: function () {
					if (this.game.getStateName() != "Night")
						return;

					if (this.actor.role.data.visitors) {
						for (let visitor of this.actor.role.data.visitors)
							if (this.dominates(visitor))
								visitor.kill("basic", this.actor);

						this.actor.role.data.visitors = [];
					}

				}
			}
		];		
	}

}