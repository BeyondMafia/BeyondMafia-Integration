const Effect = require("../Effect");

module.exports = class Cursed extends Effect {

	constructor(actor, word, lifespan) {
		super("Cursed");
		this.actor = actor;
		this.word = word;
		this.lifespan = lifespan || 1;
	}

	speak(message) {
		if (message.content.includes(this.word)) {
			this.game.queueAlert(`${this.target.name} suddenly feels a chill and falls to the ground!`);
			this.target.kill("curse", this.actor, true);
		}
	}
};