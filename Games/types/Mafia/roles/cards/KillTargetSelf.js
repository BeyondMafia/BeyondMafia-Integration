const Card = require("../../Card");

module.exports = class KillTargetSelf extends Card {

	constructor(role) {
		super(role);

		this.meetings = {
			"Kill Target and Self": {
				actionName: "Sting"
				states: ["Day"],
				flags: ["voting"],
				action: {
					labels: ["kill"],
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
