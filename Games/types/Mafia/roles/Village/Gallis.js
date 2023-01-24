const Role = require("../../Role");

module.exports = class Gallis extends Role {

    constructor(player, data) {
        super("Gallis", player, data);
        this.alignment = "Village";
        this.cards = ["VillageCore", "WinWithVillage", "FrustratedExecution"];
        this.immunity["lynch"] = 3;
        this.appearance = {
            self: "Villager"
        };
    }

}
