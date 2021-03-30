const Card = require("../../Card");

module.exports = class WinIfLynched extends Card {

	constructor(role) {
		super(role);

		this.winCheck = {
			priority: -10,
			check: function (counts, winners, aliveCount) {
				if (this.data.lynched) {
					winners.addPlayer(this.player, this.name);
					return true;
				}
			}
		};
		this.listeners = {
			"death": function (player, killer, deathType) {
				if (player == this.player && deathType == "lynch")
					this.data.lynched = true;
			}
		};
	}

}