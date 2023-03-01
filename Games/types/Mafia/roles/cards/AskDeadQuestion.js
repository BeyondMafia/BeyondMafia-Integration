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
					}
				}
			}
		};

		this.actions = [
		{
			priority: PRIORITY_MESSAGE_GIVER_DEFAULT,
			run: function(){	
				if (this.game.getStateName() === "Night"){
					this.actor.role.data.mournerYes = 0;
					this.actor.role.data.mournerNo = 0;
					for (let player of this.game.players) {
						if (!player.alive && player != this.player) {
							player.queueAlert(`The mourner asks: ${this.actor.role.data.question}`);
						}
					}
				}

				if (this.game.getStateName() === "Day"){
					if (this.actor.role.data.mournerYes && this.actor.role.data.mournerNo)
						return;

					this.player.queueAlert(`The dead has replied with ${this.actor.role.data.mournerYes} Yes's and ${this.actor.role.data.mournerNo} No's.`);
					}
				}
			}
		];

		this.listeners = {
            "rolesAssigned": function () {
                for (let player of this.game.players) {
                    player.holdItem("Mourned", {mourner: this.player});
                }
            },
			"mournerAnswer": function(response, mourner){
				if (mourner != this.player)
					return;

				if (response == "Yes")
					this.actor.role.data.mournerYes++;
				else
					this.actor.role.data.mournerNo++;
			}
        };

	}
}