const Card = require("../../Card");
const { PRIORITY_GUN_FRAME } = require("../../const/Priority");

module.exports = class GunFrame extends Card {

	constructor(role) {
		super(role);
		
		this.startItems = ["IlluGun"];
		
		this.meetings = {
			"Frame Shooter": {
				actionName: "Frame as Shooter",
				states: ["Night"],
				flags: ["voting"],
				action: {
					priority: PRIORITY_GUN_FRAME,
					run: function () {
						//…
					}
				}
			}
		};
	}

}
