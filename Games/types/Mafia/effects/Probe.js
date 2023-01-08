const Effect = require("../Effect");

module.exports = class Probe extends Effect {

	constructor(prober) {
		super("Probe");
		this.prober = prober;
	}

}