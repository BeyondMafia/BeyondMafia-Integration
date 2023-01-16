const Effect = require("../Effect");
const Action = require("../Action");
const Random = require("../../../../lib/Random");

module.exports = class Werewolf extends Effect {

	constructor() {
		super("Werewolf");

		this.listeners = {
			"state": function (stateInfo) {
				if (!this.player.alive)
					return;

				if (stateInfo.name.match(/Night/) && stateInfo.dayCount % 2 == 1)
					this.game.stateEvents["Full Moon"] = true;
			},
			"actionsNext": function (actionQueue) {
				if (!this.player.alive)
					return;

				const stateInfo = this.game.getStateInfo();

				if (!stateInfo.name.match(/Night/) || stateInfo.dayCount % 2 != 1)
					return;

				const nonMosters = this.game.players.filter(p => p.role.alignment != ALIGNMENT_MONSTERS && p.alive && p != this.player);
				const target = Random.randArrayVal(nonMosters);

				this.game.queueAction(new Action({
					actor: this.player,
					target: target,
					game: this.player.game,
					labels: [LABEL_KILL, LABEL_WEREWOLF],
					run: function () {
						if (this.dominates())
							this.target.kill(DEATH_TYPE_BASIC, this.actor);
					}
				}));
			}
		};
	}
};
