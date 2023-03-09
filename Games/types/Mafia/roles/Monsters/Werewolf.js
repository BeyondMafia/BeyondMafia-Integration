const Role = require("../../Role");

module.exports = class Werewolf extends Role {

    constructor(player, data) {
        super("Werewolf", player, data);

        this.alignment = "Monsters";
        this.cards = [
            "VillageCore",
            "WinWithMonsters",
            "HuntPrey",
            "Oblivious"
        ];
    }

}
