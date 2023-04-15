const Card = require("../../Card");

module.exports = class Astral extends Card {

    constructor(role) {
        super(role);

        this.meetingMods = {
            "*": {
               labels: labels.concat(['hidden']),
            }
        };
    }

}