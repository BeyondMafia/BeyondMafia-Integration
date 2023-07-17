const Card = require("../../Card");
const { PRIORITY_DEFAULT } = require("../../const/Priority");

module.exports = class JotterCore extends Card {

    constructor(role) {
        super(role);

        this.meetings = {
            "Guess": {
                actionName: "Guess Word",
                states: ["Guess Word"],
                flags: ["voting", "mustAct"],
                inputType: "text",
                targets: ["*"],
                textOptions: {
                    minLength: 5,
                    maxLength: 5,
                    alphaOnly: true,
                    toUpperCase: true,
                    submit: "Guess"
                },
                action: {
                    priority: PRIORITY_DEFAULT,
                    run: function() {
                        let word = this.target.toUpperCase();

                        // Check if the player guessed correctly
                        let score = this.game.getGuessScore(this.actor, word);
                        if (score == 6)
                            this.actor.role.guessedCorrectly = true;

                        this.actor.role.guesses.push({ word: word, score: score });
                        this.game.queueGuess(this.actor, word, score);
                    }
                }
            },
            "Choose": {
                actionName: "Choose Word",
                states: ["Choose Word"],
                flags: ["voting", "mustAct"],
                inputType: "text",
                targets: ["*"],
                textOptions: {
                    minLength: 5,
                    maxLength: 5,
                    alphaOnly: true,
                    toUpperCase: true,
                    submit: "Choose"
                },
                action: {
                    priority: PRIORITY_DEFAULT,
                    run: function () {
                        let word = this.target.toUpperCase();

                        this.actor.role.chosenWord = word;

                        this.game.queueChosenWord(this.actor, word);
                    }
                }
            },
            "Jotter": {
                states: ["Choose Word", "Guess Word"],
                flags: ["group", "speech"],
            }
        };
    }
}
