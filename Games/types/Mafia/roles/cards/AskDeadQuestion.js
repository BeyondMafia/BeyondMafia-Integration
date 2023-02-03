const Card = require("../../Card");
const { PRIORITY_MESSAGE_GIVER_DEFAULT } = require("../../const/Priority");

module.exports = class AskDeadQuestion extends Card {

	constructor(role) {
        super(role);
			
		this.meetings = {
			"Ask Question": {
				states: ["Day"],
				flags: ["voting"],
				inputType: "text",
				textOptions: {
					submit: "Ask"
				},
				action: {
					priority: PRIORITY_MESSAGE_GIVER_DEFAULT,
					run: function () {
						this.actor.role.data.question = this.target;
						for (let player of this.game.players) {
							if (!player.alive && player != this.player) {
								this.player.queueAlert(`The mourner asks: ${this.actor.role.data.question}`);
								this.player.holdItem("Mourned");	
							}
						}
					}
				}
			},
		}
	}
}