const Card = require("../../Card");

module.exports = class CleanseWerewolfVisitors extends Card {

	constructor(role) {
		super(role);

		this.actions = [
			{
				priority: -95,
				labels: ["cleanse", "werewolf", "hidden"],
				run: function () {
					if (this.game.getStateName() != "Night")
						return;

					var cleansedWolves = {};

					for (let action of this.game.actions[0]) {
						if (
							action.target == this.actor &&
							action.actor.hasEffect("Werewolf") &&
							action.priority > this.priority &&
							!action.hasLabel("hidden")
						) {
							action.actor.removeEffect("Werewolf", true);
							cleansedWolves[action.actor.id] = true;
						}
					}

					if (Object.keys(cleansedWolves).length == 0)
						return;

					for (let action of this.game.actions[0]) {
						if (
							action.actor &&
							cleansedWolves[action.actor.id] && 
							action.hasLabels(["kill", "werewolf"])
						) {
							action.cancel(true);
						}
					}
				}
			}
		];
	}

}