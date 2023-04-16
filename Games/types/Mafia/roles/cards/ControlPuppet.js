const Card = require("../../Card");

module.exports = class ControlPuppet extends Card {

    constructor(role) {
        super(role);
    }

    speak(message) {
        if (message.abilityName != "Control Puppet")
            return;

        message.modified = true;
        
        let puppet = this.role.game.getPlayer(message.abilityTarget);
        message.sender = puppet;
        message.parseForReview = this.parseForReview;
    }

    parseForReview(message) {
        let puppet = this.game.getPlayer(message.abilityTarget);

        message.prefix = `controlling ${puppet.name}`
        return message;
    }
}