const Winners = require("../../core/Winners");

module.exports = class JottoWinners extends Winners {

    constructor(game) {
        super(game);
    }

    // Override to display players instead of group
    queueAlerts() {
        if ("No one" in this.groups) {
            this.game.queueAlert(`No one wins!`);
            return;
        }
        for (let player of this.players) {
            this.game.queueAlert(`${player.name} wins!`);
        }
    }
}