const Effect = require("../Effect");

module.exports = class KillImmune extends Effect {

	constructor(immunity) {
		super("Kill Immune");

		this.immunity[LABEL_KILL] = immunity || 1;
		this.cancelImmunity = [LABEL_LYNCH];
	}
};
