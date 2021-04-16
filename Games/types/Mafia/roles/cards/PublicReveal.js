const Card = require("../../Card");

module.exports = class PublicReveal extends Card {

	constructor(role) {
		super(role);

		this.listeners = {
			"state": function (stateInfo) {
				if (!this.data.revealed) {
					this.data.revealed = true;
					this.revealToAll();
				}
			}
		};
	}

}