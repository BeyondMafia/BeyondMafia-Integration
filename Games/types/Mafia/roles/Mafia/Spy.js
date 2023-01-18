const Role = require("../../Role");

module.exports = class Spy extends Role {

    constructor(player, data) {
        super("Spy", player, data);

        this.alignment = "Mafia";
        this.cards = ["VillageCore", "WinWithMafia", "MeetingMafia", "GuessAdversaryKill"];
        this.roleToGuess = "Agent";
        this.meetingMods = {
            "Guess Adversary": {
                actionName: "Guess Agent"
            }
        };
    }

}