const Card = require("../../Card");

module.exports = class WinWithMonsters extends Card {

	constructor(role) {
		super(role);

		this.winCheck = {
			priority: 0,
			check: function (counts, winners, aliveCount) {
				if (counts["Monsters"] >= aliveCount / 2 && aliveCount > 0)
					winners.addPlayer(this.player, "Monsters");
			}
		};
		this.listeners = {
			"start": function () {
				for (let player of this.game.players)
					if (player.role.alignment == "Monsters" && player != this.player)
						this.revealToPlayer(player);
			}
		};
	}

}