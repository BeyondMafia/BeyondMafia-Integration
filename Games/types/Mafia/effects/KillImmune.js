const Effect = require("../Effect");

module.exports = class KillImmune extends Effect {

	constructor(immunity) {
		super("Kill Immune");

		this.immunity["kill"] = immunity || 1;
		this.cancelImmunity = [DEATH_TYPE_LYNCH];
	}
};
