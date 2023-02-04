const Role = require("../../Role");

module.exports = class Ninja extends Role {

    constructor(player, data) {
        super("Ninja", player, data);
        this.alignment = "Mafia";
        this.cards = ["VillageCore", "WinWithMafia", "MeetingMafia"];
        this.meetingMods = {
            "Mafia": {
                action: {
                    labels: ["kill", "mafia", "hidden"],
                    priority: PRIORITY_MAFIA_MEETING,
                    run: function () {
                        if (this.dominates())
                            this.target.kill("basic", this.actor);
                    }
                }
            }
        };
    }
