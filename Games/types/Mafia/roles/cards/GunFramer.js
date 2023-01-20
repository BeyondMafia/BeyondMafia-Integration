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
						while (this.startItems.include("Gun") == true) {
							this.startItems.splice(this.startItems.indexOf("Gun"), 1);
							this.actor.holdItem("Gun", {reveal:true, shooter: this.target})
						}
					}
				}
			}
		};
	}

}
