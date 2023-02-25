const Role = require("../../Role");

module.exports = class Gambler extends Role {

    constructor(player, data) {
        super("Gambler", player, data);

        this.alignment = "Independent";
        this.winCount = "Village";
        this.cards = ["VillageCore", "WinIfBeatThrice"];
    }

}
