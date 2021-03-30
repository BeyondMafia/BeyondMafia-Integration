const Card = require("../../Card");

module.exports = class WinIfAlive extends Card {

	constructor(role) {
		super(role);

		this.winCheck = {
			priority: -5,
			check: function(counts, winners, aliveCount) {
				if (this.player.alive)
					winners.addPlayer(this.player, this.name);
			}
		};
	}

}