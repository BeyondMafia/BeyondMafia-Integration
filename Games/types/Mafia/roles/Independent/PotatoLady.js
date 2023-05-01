const Role = require("../../Role");

module.exports = class PotatoLady extends Role {

    constructor(player, data) {
        super("Potato Lady", player, data);

        this.alignment = "Independent";
        this.cards = ["VillageCore", "WinIfHotPotatoKillsTwo", "HotPotatoGiver"];
    }

}