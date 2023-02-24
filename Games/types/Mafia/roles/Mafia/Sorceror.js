const Role = require("../../Role");

module.exports = class Sorceror extends Role {

    constructor(player, data) {
        super("Sorceror", player, data);

        this.alignment = "Mafia";
        this.cards = ["VillageCore", "WinWithMafia", "MeetingMafia", "CurseWithWord"];
    }

}