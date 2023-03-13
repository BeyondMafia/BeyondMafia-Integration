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
                    
                    let numGiven = 0;
                    for (let player of this.game.players) {
                        if (!player.alive) {
                            player.holdItem("Mourned", {
                                mourner: this.actor,
                                question: this.actor.role.data.question,
                                meetingName: this.actor.role.data.meetingName,
                            });
                            numGiven += 1;
                        }
                    }
                    this.actor.role.data.numGiven = numGiven;
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
                    let numGiven = this.actor.role.data.numGiven;
        
                    let numDidNotReply = numGiven - numYes - numNo;
                    let totalResponses = numGiven - numDidNotReply;

                    let percentNo = (numYes / totalResponses) * 100;
                    let percentYes = (numNo / totalResponses) * 100;


                    this.actor.queueAlert(`The dead has replied with ${percentNo}% Yes's and ${percentYes}% No's.`);
                }
            }
        ];

        this.listeners = {
        }
    }
}