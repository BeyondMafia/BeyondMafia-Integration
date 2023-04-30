const Role = require("../../Role");

module.exports = class Ghost extends Role {

    constructor(player, data) {
        super("Ghost", player, data);

        this.alignment = "Ghost";
        this.cards = ["WinWithGhost", "MeetingGhost"];
        this.wordLength = this.game.wordLength;

        this.listeners = {
            "start": function () {
                for (let player of this.game.players) {
                    if (player.role.alignment == "Ghost" && player != this.player) {
                        this.revealToPlayer(player);
                    }
                }
                
                this.player.queueAlert(`Guess the hidden word of length: ${this.game.wordLength}`);
            }
        }
    }

}