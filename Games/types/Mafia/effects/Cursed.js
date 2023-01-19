const Effect = require("../Effect");
const Action = require("../Action");
const { LABEL_KILL, LABEL_CURSE } = require("../const/ActionLabel");
const { DEATH_TYPE_CURSE } = require("../const/DeathType").default

module.exports = class Cursed extends Effect {

	constructor(actor, word, lifespan) {
		super("Cursed");
		this.actor = actor;
		this.word = word;
		this.lifespan = lifespan || 1;
	}

	speak(message) {
		if (message.content.includes(this.word)) {
			var action = new Action({
				actor: this.actor,
				target: this.player,
				labels: [LABEL_KILL, LABEL_CURSE],
				run: function () {
					if (this.dominates())
						this.target.kill(DEATH_TYPE_CURSE, this.actor, true);
				}
			});
			
			this.game.instantAction(action)
		}
	}
};