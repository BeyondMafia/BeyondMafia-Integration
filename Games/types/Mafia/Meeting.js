const Meeting = require("../../core/Meeting");

module.exports = class MafiaMeeting extends Meeting {

    constructor(name, game) {
        super(name, game);
    }

    speak(message) {
        var member = this.members[message.sender.id];

        if (!member.player.alive) {
            if (this.name.includes("Village") ||
                this.name.includes("Graveyard") ||
                this.name.includes("Party!")) {

                let defaultRecipients = this.game.players.filter(x => !x.alive);
                super.speak(message, defaultRecipients);
                return
            }
        }

        super.speak(message);
    }

    finish(isVote) {
        super.finish(isVote);

        // for (let member of this.members) {
        //     if (this.votes[member.id])
        //         member.player.recordStat("participation", true);
        //     else
        //         member.player.recordStat("participation", false);
        // }
    }

}