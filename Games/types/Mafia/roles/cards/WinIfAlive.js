const Card = require("../../Card");

module.exports = class WinIfAlive extends Card {

	constructor(role) {
		super(role);

		this.winCount = "Village";
		this.winCheck = {
			priority: 0,
			againOnFinished: true,
			check: function (counts, winners, aliveCount, confirmedFinished) {
				if (
					this.player.alive && (
						(!confirmedFinished && counts["Village"] == aliveCount) || // Only Suvivors remain
						(confirmedFinished && !winners.groups[this.name]))
				) {
					winners.addPlayer(this.player, this.name);
				}
			}
		};
	}

}