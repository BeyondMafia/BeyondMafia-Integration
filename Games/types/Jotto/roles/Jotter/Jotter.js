const Role = require("../../Role");

module.exports = class Jotter extends Role {

    constructor(player, data) {
        super("Jotter", player, data);

        this.alignment = "Jotter";
        this.cards = ["JotterCore", "WinCorrectGuess"];

        this.chosenWord = null;
        this.guessedCorrectly = false;
        this.guessedWords = [];
        this.opponentTargetId = null;
        this.opponentAttackerId = null;
    }

}