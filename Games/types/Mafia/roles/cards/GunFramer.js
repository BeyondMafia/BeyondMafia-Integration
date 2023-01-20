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
						while (this.items.include("Gun") == true) {
							this.items.splice(this.items.indexOf("Gun"), 1);
							this.actor.holdItem("Gun", {reveal:true, shooter: this.target})
						}
					}
				}
			}
		};
	}

}
