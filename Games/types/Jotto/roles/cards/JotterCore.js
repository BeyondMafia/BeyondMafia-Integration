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

                        // Record guess into history and add it to the player's guess list
                        this.game.recordGuess(this.actor, word, score);
                        this.actor.role.guessedWords.push({"word": word, "score": score});
                    }
                }
            },
            "Choose": {
                actionName: "Choose Word",
                states: ["Choose Word"],
                flags: ["voting", "mustAct"],
                inputType: "text",
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

                        // Record word into history and set the player's chosen word
                        this.game.recordWord(this.actor, word);
                        this.actor.role.chosenWord = word;
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
