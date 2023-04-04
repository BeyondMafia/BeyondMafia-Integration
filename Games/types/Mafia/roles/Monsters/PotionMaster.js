const Role = require("../../Role");

module.exports = class PotionMaster extends Role {

    constructor(player, data) {
        super("Potion Master", player, data);

        this.alignment = "Monsters";
        this.cards = [
            "VillageCore",
            "WinWithMonsters",
            "MeetingMonster",
            "PotionCaster"
        ];
    }

}