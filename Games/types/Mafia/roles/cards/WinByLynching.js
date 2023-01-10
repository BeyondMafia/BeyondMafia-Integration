const Card = require("../../Card");
const Random = require("../../../../../lib/Random");
const { PRIORITY_WIN_BY_LYNCHING } = require("../../const/Priority");

module.exports = class WinByLynching extends Card {

	constructor(role) {
		super(role);
		this.target = "";
		const deathReasons = ["putting pineapple on pizza", "shopping at five or six stores instead of one", "leaving their lights on at night", "backing up into your mailbox", "forgetting to water your plants", "unfriending you on BeyondMafia", "Rickrolling you", "looking at you funny", "being wrong in Mafia once", "making you look bad", "chewing open-mouthed", "borrowing your lawnmower and never bringing it back", "stealing your lunch at work", "forgetting your birthday"];


		this.winCheck = {
			priority: PRIORITY_WIN_BY_LYNCHING,
			check: function (counts, winners, aliveCount) {
				if (this.data.targetLynched) {
					winners.addPlayer(this.player, this.name);
					return true;
				}
			}
		};
		this.listeners = {

			"state": function (stateInfo) {
				if (!this.player.alive)
					return;

				if (stateInfo.dayCount == 0) {
					const nonMafia = this.game.players.filter(p => (
						(p.role.alignment == "Village" || p.role.winCount == "Village") &&
						p.alive &&
						p != this.player
					));
					this.target = Random.randArrayVal(nonMafia);
					this.pettyReason = Random.randArrayVal(deathReasons);
					this.player.queueAlert(`You wish to see ${this.target.name} executed for ${this.pettyReason}.`);
				}
			},
			"death": function (player, killer, deathType) {
				if (player == this.target && deathType == "lynch" && this.player.alive) {
					this.data.targetLynched = true;


				}
			}
		};
	}

}