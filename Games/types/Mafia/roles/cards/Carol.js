const Card = require("../../Card");
const { PRIORITY_CAROL } = require("../../const/Priority");

module.exports = class Carol extends Card {

	constructor(role) {
		super(role);

		this.meetings = {
			"Sing Carol": {
				states: ["Night"],
				flags: ["voting"],
				action: {
					labels: ["carol"],
					priority: PRIORITY_CAROL,
					run: function () {
						// Code borrowed from Executioner, Neighbor and Oracle
						const alive = this.game.players.filter(p => (p.alive));
						const mafia = alive.filter(p => ((p.role.alignment == "Mafia" || p.role.winCount == "Mafia")));
						const players = [Random.randArrayVal(this.game.players), Random.randArrayVal(this.game.players), Random.randArrayVal(Mafia)];
						const randomised = [Random.randArrayVal(players), Random.randArrayVal(players), Random.randArrayVal(players)];
						var carol = `You see a merry Caroler outside your house! They sing you a Carol about ${randomised[0]}, ${randomised[1]}, ${randomised[2]}. At least one of which is the Mafia!`;
						if (this.target.meetings == {} && this.actor.role.data.oldTarget != this.target) {
							this.target.queueAlert(carol);
							this.actor.role.data.oldTarget = this.target;
						}
					}
				}
			}
		};
	}

}
