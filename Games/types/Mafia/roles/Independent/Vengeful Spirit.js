const Role = require("../../Role");

module.exports = class Ghost extends Role {

    constructor(player, data) {
        super("Ghost", player, data);
        this.alignment = "Village";
        this.cards = ["VillageCore", "NightKiller","WinIfTargetDead"];
        this.meetingMods = {
            "Solo Kill": {
                whileDead: true,
                whileAlive: false
            }
        };
    }
}
