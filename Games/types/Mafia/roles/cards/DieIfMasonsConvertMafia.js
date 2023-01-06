const Card = require("../../Card");

module.exports = class DieIfMasonsConvertMafia extends Card {

	constructor(role) {
		super(role);

		this.actions = [
			{
				priority: 1,
				run: function () {
					if (this.game.getStateName() != "Night")
						return;

					for (let action of this.game.actions[0]) {
						if (
							action.hasLabels(["convert", "mason"]) &&
							action.target.role.alignment == "Mafia"
						) {
							this.actor.kill("basic");
						}
					}
				}
			}
		];
	}

}