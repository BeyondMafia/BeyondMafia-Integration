const Role = require("../../Role");

module.exports = class Apprentice extends Role {

    constructor(player, data) {
        super("Apprentice", player, data);

        this.alignment = "Mafia";
        this.cards = ["VillageCore", "WinWithMafia", "MeetingMafia", "BecomeDeadMafia"];
    }

}
