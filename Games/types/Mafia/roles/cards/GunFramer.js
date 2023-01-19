const Card = require("../../Card");
const { PRIORITY_GUN_FRAME } = require("../../const/Priority");

module.exports = class GunFramer extends Card {

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
						var items = this.actor.items;
						if (items.include("IlluGun") == true) {
							this.role.data.framed = this.target.name;
						}
					}
				}
			}
		};
	}

}
