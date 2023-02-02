const Item = require("../Item");

module.exports = class Flier extends Item {

    constructor(reveal) {
        super("Flier");

        this.reveal = reveal;
        this.lifespan = 1;

        this.meetings = {
            "Party!": {
                actionName: "Done Partying?",
                states: ["Night"],
                flags: ["group", "speech", "voting", "mustAct", "noVeg"],
                inputType: "boolean",
            }
        };
    }
}