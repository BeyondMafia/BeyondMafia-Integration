module.exports = class Action {

	constructor(options) {
		this.actor = options.actor;
		this.game = options.actor.game;
		this.target = options.target;
		this.meeting = options.meeting;
		this.run = options.run.bind(this);
		this.labels = options.labels || [];
		this.priority = options.priority || 0;
		this.delay = options.delay || 0;
		this.power = options.power || 1;
		this.effect = options.effect;
		this.item = options.item;

		this.priority += this.actor.role.priorityOffset;
	}

	do() {
		this.run();
	}

	dominates(player) {
		player = player || this.target;
		var notImmune = true;

		for (let label of this.labels) {
			notImmune &= player.getImmunity(label) < this.power;

			if (player.getCancelImmunity(label))
				return true;
		}

		if (!notImmune)
			this.game.events.emit("immune", this);

		return notImmune;
	}

	hasLabel(label) {
		return this.labels.indexOf(label) != -1;
	}

	hasLabels(labels) {
		for (let label of labels)
			if (this.labels.indexOf(label) == -1)
				return false;

		return true;
	}

	cancel(clearInfo) {
		this.do = () => { };

		if (clearInfo) {
			delete this.actor;
			delete this.target;
		}
	}

}