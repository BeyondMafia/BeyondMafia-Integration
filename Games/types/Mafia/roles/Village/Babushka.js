const Role = require("../../Role");

module.exports = class Babushka extends Role {

    constructor(player, data) {
        super("Babushka", player, data);

        this.alignment = "Village";
        this.cards = [
            "VillageCore",
            "WinWithVillage",
            "KillImmune",
            "KillVisitors"
        ];
    }

}