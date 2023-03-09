const Role = require("../../Role");

module.exports = class Vampire extends Role {

    constructor(player, data) {
        super("Vampire", player, data);

        this.alignment = "Monsters";
        this.cards = [
            "VillageCore",
            "WinWithMonsters",
            "MeetingMonster",
            "Infect",
            "FullMoonInvincible",
            "CauseFullMoons"
        ];
    }

}
