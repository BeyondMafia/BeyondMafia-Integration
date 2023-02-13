const Role = require("../../Role");

module.exports = class Merlin extends Role {

    constructor(player, data) {
        super("Merlin", player, data);

        this.alignment = "Resistance";
        this.appearance = {
            percival : "Merlin"
        };
        this.cards = ["TeamCore", "WinWithResistance", "Foresight"];
    }

}