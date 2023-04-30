const Role = require("../../Role");

module.exports = class Fool extends Role {

    constructor(player, data) {
        super("Fool", player, data);

        this.alignment = "Town";
        this.cards = ["WinWithTown"];
        this.appearance = {
            self: "Town"
        };
        this.listeners = {
            "start": function () {
                this.player.queueAlert(`The secret word is: ${this.game.foolWord}`);
            }
        }
    }

}