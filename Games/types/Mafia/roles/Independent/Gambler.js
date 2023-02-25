const Role = require("../../Role");

module.exports = class Gambler extends Role {

    constructor(player, data) {
        super("Survivor", player, data);

        this.alignment = "Independent";
        this.cards = ["VillageCore", "WinIfBeatThrice"];
    }

}
