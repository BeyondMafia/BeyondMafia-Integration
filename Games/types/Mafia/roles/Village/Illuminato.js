const Role = require("../../Role");

module.exports = class Illuminato extends Role {

    constructor(player, data) {
        super("Illuminato", player, data);

        this.alignment = "Village";
        this.cards = ["VillageCore", "WinWithVillage", "MeetWithIlluminati"];
    }

}