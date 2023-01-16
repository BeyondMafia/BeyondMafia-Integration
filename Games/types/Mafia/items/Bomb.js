const Item = require("../Item");
const Action = require("../Action");

module.exports = class Bomb extends Item {

	constructor() {
		super("Bomb");

		this.listeners = {
			"death": function (player, killer, deathType, instant) {
				if (player == this.holder && killer && deathType != DEATH_TYPE_LYNCH) {
					var action = new Action({
						actor: this.holder,
						target: killer,
						game: this.holder.game,
						labels: [LABEL_KILL, LABEL_BOMB],
						run: function () {
							if (this.dominates())
								this.target.kill(DEATH_TYPE_BOMB, this.actor, instant);
						}
					});

					action.do();
				}
			}
		};
	}
};
