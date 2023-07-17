const Role = require("../../Role");

module.exports = class Jotter extends Role {

    constructor(player, data) {
        super("Jotter", player, data);

        this.alignment = "Jotter";
        this.cards = ["JotterCore", "WinCorrectGuess"];

        this.guesses = [];
        this.chosenWord = null;
        this.guessedCorrectly = false;
        this.attackerId = null;
        this.targetId = null;
    }

    // don't alert, jotter should already be exposed
    revealToAll(noAlert, revealType) {
        super.revealToAll(true, revealType);
    }

}