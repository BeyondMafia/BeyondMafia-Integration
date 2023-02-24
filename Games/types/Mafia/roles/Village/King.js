const Role = require("../../Role");

module.exports = class King extends Role {

    constructor(player, data) {
        super("King", player, data);

        this.alignment = "Village";
        this.appearance = {
            self: "Villager"
        };
        this.meetingMods = {
            "Village": {
                voteWeight: Infinity
            }
        }
        this.cards = ["VillageCore", "WinWithVillage"];
    }
}