const Card = require("../../Card");

module.exports = class WinAmongLastTwo extends Card {

	constructor(role) {
		super(role);

		this.winCheck = {
			priority: 0,
			check: function (counts, winners, aliveCount) {
				if (aliveCount <= 2 && this.player.alive)
					winners.addPlayer(this.player, this.name);
			}
		};
	}

}