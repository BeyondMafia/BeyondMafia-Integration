const Role = require("../../Role");

module.exports = class VoodooLady extends Role {

    constructor(player, data) {
        super("Voodoo Lady", player, data);

        this.alignment = "Mafia";
        this.cards = ["VillageCore", "WinWithMafia", "MeetingMafia", "CurseWithWord"];
    }

}