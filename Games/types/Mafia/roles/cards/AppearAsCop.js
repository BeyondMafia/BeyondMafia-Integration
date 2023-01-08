const Card = require("../../Card");

module.exports = class AppearAsSuspect extends Card {

	constructor(role) {
		super(role);

		this.appearance = {
			self: "Cop",
			reveal: "Cop",
			lynch: "Cop",
			death: "Cop",
			investigate: "Cop"
		};
	}

}