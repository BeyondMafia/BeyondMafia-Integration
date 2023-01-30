const Card = require("../../Card");

module.exports = class OnlyWhileDead extends Card {

    constructor(role) {
        super(role);

        this.meetingMods = {
            "*": {
                whileDead: true,
                whileAlive: false
            },
            "VillageCore": {
                whileAlive: true
            }
        };
    }
}