const Card = require("../../Card");
const { PRIORITY_MISMASON_MAFIA } = require("../../const/Priority");

module.exports = class DieIfMasonsConvertMafia extends Card {

	constructor(role) {
		super(role);

		this.actions = [
			{
				priority: PRIORITY_MISMASON_MAFIA,
				run: function () {
					if (this.game.getStateName() != "Night")
						return;

					for (let action of this.game.actions[0]) {
						if (
							action.hasLabels(["convert", "mason"]) &&
							action.target &&
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