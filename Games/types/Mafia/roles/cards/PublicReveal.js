const Card = require("../../Card");

module.exports = class PublicReveal extends Card {

	constructor(role) {
		super(role);

		this.listeners = {
			"state": function (stateInfo) {
				if (stateInfo.id == 0 && !this.data.revealed) {
					this.revealToAll();
					this.data.revealed = true;
				}
			}
		};
	}

}