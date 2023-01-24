const Card = require("../../Card");
const { PRIORITY_GUN_FRAME } = require("../../const/Priority");

module.exports = class GunFramer extends Card {

	constructor(role) {
		super(role);
		
		this.startItems = ["Gun"];
		
		this.meetings = {
			"Frame Shooter": {
				actionName: "Frame as Shooter",
				states: ["Night"],
				flags: ["voting"],
				action: {
					priority: PRIORITY_GUN_FRAME,
					run: function () {
						this.actor.data.shooterMask = this.target
						var items = this.actor.items;
						while (items.include("Gun") == true) {
							items.splice(items.indexOf("Gun"), 1);
							this.actor.holdItem("IlluGun");
						}
					}
				}
			}
		};
	}

}
