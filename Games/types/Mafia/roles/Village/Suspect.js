const Role = require("../../Role");

module.exports = class Suspect extends Role {

    constructor(player, data) {
        super("Suspect", player, data);

        this.alignment = "Village";
        this.cards = ["VillageCore", "WinWithVillage", "AppearAsSuspect"];
    }

}