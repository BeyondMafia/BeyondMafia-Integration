const Card = require("../../Card");
const { PRIORITY_GUN_FRAME } = require("../../const/Priority");

module.exports = class GunFramer extends Card {

	constructor(role) {
		super(role);
		
		this.meetings = {
			"Frame Shooter": {
				actionName: "Frame as Shooter",
				states: ["Night"],
				flags: ["voting"],
				action: {
					priority: PRIORITY_GUN_FRAME,
					run: function () {
						this.actor.holdItem("Gun", {reveal:true, shooter: this.target});
					}
				}
			}
		};
	}

}
