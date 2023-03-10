const Role = require("../../Role");

module.exports = class Priest extends Role {

    constructor(player, data) {
        super("Priest", player, data);

        this.alignment = "Village";
        this.cards = [
            "VillageCore",
            "WinWithVillage",
            "CleanseInfectedVisitors",
            "KillLycanVisitors"
        ];
        this.immunity.infect = 1;
    }

}
