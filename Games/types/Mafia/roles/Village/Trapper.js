const Role = require("../../Role");

module.exports = class Trapper extends Role {

    constructor(player, data) {
        super("Trapper", player, data);

        this.alignment = "Village";
        this.cards = ["VillageCore", "WinWithVillage", "NightTrapper"];
    }

}
