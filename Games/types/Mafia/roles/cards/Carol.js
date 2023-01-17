const Card = require("../../Card");
const Random = require("../../../../../lib/Random");
const { PRIORITY_CAROL } = require("../../const/Priority");

module.exports = class Carol extends Card {

	constructor(role) {
		super(role);

		this.meetings = {
			"Sing Carol": {
				states: ["Night"],
				flags: ["voting"],
				targets: { include: ["alive"], exclude: ["self", isPrevTarget] },
				action: {
					labels: ["carol"],
					priority: PRIORITY_CAROL,
					run: function () {
						if (this.game.players.length < 3)
							return;

						this.actor.role.data.prevTarget = this.target;

						for (let action of this.game.actions[0]) {
							if (
								action.actors.indexOf(this.target) != -1 &&
								action.priority < this.priority &&
								!action.hasLabel("hidden")
							) {
								return;
							}
						}

						var carol;
						var alive = this.game.players.filter(p => p.alive);
						var mafia = alive.filter(p => p.role.alignment == "Mafia");
						var chosenThree = [
							Random.randArrayVal(alive, true),
							Random.randArrayVal(alive, true),
							Random.randArrayVal(alive, true)
						];

						if (mafia.length == 0)
							carol = `You see a merry Caroler outside your house! They sing you a happy song about all of the Mafia being dead!`;
						else {
							if (chosenThree.filter(p => p.role.alignment == "Mafia").length == 0) {
								chosenThree[0] = Random.randArrayVal(mafia);
								chosenThree = Random.randomizeArray(chosenThree);
							}

							carol = `You see a merry Caroler outside your house! They sing you a Carol about ${chosenThree[0].name}, ${chosenThree[1].name}, ${chosenThree[2].name}, at least one of whom is the Mafia!`;
						}

						this.target.queueAlert(carol);
					}
				}
			}
		};
	}

}

function isPrevTarget(player) {
	return this.role && player == this.role.data.prevTarget;
}