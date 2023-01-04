const Card = require("../../Card");
const { PRIORITY_WIN_ALL_SAME_ROLE } = require("../../const/Priority");

module.exports = class WinAllSameRole extends Card {

	constructor(role) {
		super(role);

		this.winCheck = {
			priority: PRIORITY_WIN_ALL_SAME_ROLE,
			check: function (counts, winners, aliveCount) {
				if (counts[this.name] == aliveCount)
					winners.addPlayer(this.player, this.name);
			}
		};
	}

}