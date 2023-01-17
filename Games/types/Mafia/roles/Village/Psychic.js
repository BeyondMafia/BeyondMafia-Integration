const Role = require("../../Role");

module.exports = class Psychic extends Role {

    constructor(player, data) {
        super("Psychic", player, data);

        this.alignment = "Village";
        this.cards = ["VillageCore", "WinWithVillage", "ContactByRole"];
        this.meetingMods = {
            "Village": {
                speechAbilities: [{
                    name: "Contact",
                    targetsDescription: { include: ["all"], exclude: ["Village"] },
                    targetType: "role",
                    verb: ""
                }]
            }
        };
    }

}