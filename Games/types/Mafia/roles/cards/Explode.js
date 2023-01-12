const Card = require("../../Card");
const { PRIORITY_EXPLODE } = require("../../const/Priority");

module.exports = class Explode extends Card {

	constructor(role) {
		super(role);

		this.meetings = {
			"Explode": {
				states: ["Day"],
				flags: ["voting"],
				action: {
					labels: ["kill"],
					priority: PRIORITY_EXPLODE,
					run: function () {
						this.game.queueAlert(`${this.actor.name} rushes at ${this.target.name} and reveals a bomb!`);
						if (this.dominates())
							this.target.kill("basic", this.actor);
							this.actor.kill("basic", this.actor);
					}
				}
			}
		};
	}

}
