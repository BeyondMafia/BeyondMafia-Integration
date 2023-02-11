const Effect = require("../Effect");
const Action = require("../Action");

module.exports = class Cursed extends Effect {

    constructor(actor, word, lifespan) {
        super("Cursed");
        this.actor = actor;
        this.word = word;
        this.lifespan = lifespan || 1;
    }

    speak(message) {
        if (message.content.replace(' ', '').toLowerCase().includes(this.word)) {
            var action = new Action({
                actor: this.actor,
                target: this.player,
                game: this.actor.game,
                labels: ["kill", "curse"],
                run: function () {
                    if (this.dominates())
                        this.target.kill("curse", this.actor, true);
                }
            });
            
            this.game.instantAction(action)
        }
    }
};