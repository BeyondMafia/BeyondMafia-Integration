const Role = require("../../Role");

module.exports = class Town extends Role {

    constructor(player, data) {
        super("Town", player, data);

        this.alignment = "Town";
        this.cards = ["WinWithTown"];
        this.listeners = {
            "start": function () {
                this.player.queueAlert(`The secret word is: ${this.game.townWord}`);
            }
        }
    }

}