const Card = require("../../Card");

module.exports = class WinWithMafia extends Card {

	constructor(role) {
		super(role);

		this.winCheck = {
			priority: 0,
			check: function (counts, winners, aliveCount) {
				if (counts["Mafia"] >= aliveCount / 2 && aliveCount > 0)
					winners.addPlayer(this.player, "Mafia");
			}
		};
		this.listeners = {
			"start": function () {
				for (let player of this.game.players)
					if (player.role.alignment == "Mafia" && player != this.player)
						this.revealToPlayer(player);
			}
		};
	}

}
