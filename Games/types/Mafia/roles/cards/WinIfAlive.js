const Card = require("../../Card");

module.exports = class WinIfAlive extends Card {

	constructor(role) {
		super(role);

		this.winCount = "Village";
		this.winCheck = {
			priority: -5,
			finishedOnly: true,
			check: function(counts, winners, aliveCount) {
				if (this.player.alive)
					winners.addPlayer(this.player, this.name);
			}
		};
	}

}