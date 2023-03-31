const Card = require("../../Card");
const { PRIORITY_DAY_DEFAULT, PRIORITY_MESSAGE_GIVER_DEFAULT } = require("../../const/Priority");

module.exports = class AskDeadQuestion extends Card {

    constructor(role) {
        super(role);
                
        // here, mourner decides the question to ask
        this.meetings = {
            "Ask Question": {
                states: ["Day"],
                flags: ["voting"],
                inputType: "text",
                textOptions: {
                    submit: "Ask"
                },
                action: {
                    priority: PRIORITY_DAY_DEFAULT,
                    run: function () {
                        this.actor.role.data.question = this.target;
                        this.actor.role.data.meetingName = 'Answer Mourner asking "' + this.actor.role.data.question + '"';
                        this.actor.role.data.mournerYes = 0;
                        this.actor.role.data.mournerNo = 0;
                    }
                }
            }
        };
        this.actions = [
            // give mourned item to dead
            {
                // we want to give the village elimination the mourned item as well
                priority: PRIORITY_DAY_DEFAULT + 1,
                run: function() {
                    if (!this.actor.alive) {
                        return;
                    }

                    if (this.game.getStateName() !== "Day") {
                        return;
                    }

                    if (!this.actor.role.data.question) {
                        return;
                    }
                    
                    for (let player of this.game.players) {
                        if (!player.alive) {
                            player.holdItem("Mourned", {
                                mourner: this.actor,
                                question: this.actor.role.data.question,
                                meetingName: this.actor.role.data.meetingName,
                            });
                        }
                    }
                }
            },

            // collect the replies at night
            {
                priority: PRIORITY_MESSAGE_GIVER_DEFAULT + 1,
                run: function() {
                    if (!this.actor.alive) {
                        return;
                    }

                    if (this.game.getStateName() !== "Night") {
                        return;
                    }

                    if (!this.actor.role.data.question) {
                        return;
                    }
                                
                    let numYes = this.actor.role.data.mournerYes;
                    let numNo = this.actor.role.data.mournerNo;
        
                    let totalResponses = numYes + numNo;

                    let percentNo = (numNo / totalResponses) * 100;
                    let percentYes = (numYes / totalResponses) * 100;

                    if (totalResponses === 0)
                        this.actor.queueAlert(`You receive no responses from the dead.`);
                    else
                        this.actor.queueAlert(`The dead has replied with ${percentYes}% Yes's and ${percentNo}% No's.`);
                }
            }
        ];
    }
}