const Item = require("../Item");

module.exports = class Microphone extends Item {

    constructor() {
        super("Microphone");

        this.meetings = {
            "Give Clue": {
                states: ["Give Clue"],
                flags: ["instant", "voting"],
                inputType: "text",
                textOptions: {
                    minLength: 4,
                    maxLength: 50,
                    submit: "Confirm"
                },
                canVote: true,
                action: {
                    run: function() {
                        this.game.sendAlert(`${this.actor.name}: ${this.target}`);
                    }
                }
            }
        }
    }
};