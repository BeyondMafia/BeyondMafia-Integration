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
                                mourner: this.player,
                                question: this.player.role.data.question,
                            });
                            numGiven += 1;
                        }
                    }
                    this.actor.role.data.mournerYes = 0;
                    this.actor.role.data.mournerNo = 0;
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

                    if (this.game.getStateName() !== "Day") {
                        return;
                    }

                    if (!this.actor.role.data.question) {
                        return;
                    }
                                        
                    let numYes = this.actor.role.data.mournerYes;
                    let numNo = this.actor.role.data.mournerNo;
                    // let numDidNotReply = this.actor.role.data.numGiven - numYes - numNo;
                    // this.actor.mournerYes/(numGiven-numDidNotReply)
                    // this.actor.mournerNo/(numGiven-numDidNotReply)
                    this.player.queueAlert(`The dead has replied with ${numYes} Yes's and ${numNo} No's.`);
                }
            }
        ];
    }
}