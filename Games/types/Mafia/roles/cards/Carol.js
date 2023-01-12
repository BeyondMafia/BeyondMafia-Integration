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
				action: {
					labels: ["carol"],
					priority: PRIORITY_CAROL,
					run: function () {
						var carol;
						var alive = this.game.players.filter(p => p.alive);
						var chosenThree = [
							Random.randArrayVal(alive, true),
							Random.randArrayVal(alive, true),
							Random.randArrayVal(alive, true)
						];

						if (chosenThree.filter(p => p.role.alignment == "Mafia").length == 0) {

						}

						if (mafia.length > 0) {
							chosenThree.push(Random.randArrayVal(mafia));
							chosenThree = Random.randomizeArray(chosenThree);

							carol = "You see a merry Caroler outside your house! \
								They sing you a Carol about " + chosenThree[0].name + ", " + chosenThree[1].name + ", " + chosenThree[2].name + ",\
								at least one of whom is the Mafia!";
						}
						else {
							carol = `You see a merry Caroler outside your house! \
								They sing you a happy song about all of the Mafia being dead!`;
						}

						var targetVisits = false;

						for (let action of this.game.actions[0]) {
							if (action.actor == this.target && !action.hasLabel("hidden")) {
								targetVisits = true;
								break;
							}
						}

						if (!targetVisits && this.target != this.actor.role.data.prevTarget)
							this.target.queueAlert(carol);

						this.actor.role.data.prevTarget = this.target;
					}
				}
			}
		};
	}

}
