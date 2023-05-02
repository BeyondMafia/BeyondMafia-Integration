const Role = require("../../Role");

module.exports = class Anarchist extends Role {

    constructor(player, data) {
        super("Anarchist", player, data);

        this.alignment = "Independent";
        this.cards = ["VillageCore", "WinIfTickingBombKillsTwo", "TickingBombGiver"];
    }

}