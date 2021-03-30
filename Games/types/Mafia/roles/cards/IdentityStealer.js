const Card = require("../../Card");

module.exports = class IdentityStealer extends Card {

	constructor(role) {
		super(role);

		this.meetings = {
			"Steal Identity": {
				actionName: "Disguise as Target?",
				states: ["Night"],
				flags: ["voting"],
				inputType: "boolean",
				action: {
					priority: -2,
					run: function () {
						if (this.target == "No")
							return;

						for (let action of this.game.actions[0]) {
							if (action.hasLabels(["kill", "mafia"])) {
								var newTarget = this.actor;
								stealIdentity.bind(this.actor.role)(action.target);
								action.target = newTarget;
								break;
							}
						}
					}
				}
			}
		};
		this.listeners = {
			"death": function (player, killer, deathType) {
				if (player == this.player)
					resetIdentities.bind(this)();
			},
			"aboutToFinish": function() {
				resetIdentities.bind(this)();
			} 
		};
		this.stealableListeners = {
			"death": this,
			"aboutToFinish": this
		};
	}

}

function stealIdentity(target) {
	if (!this.data.swaps)
		this.data.swaps = [];

	if (!this.data.originalUser)
		this.data.originalUser = this.player.user;

	this.data.swaps.unshift([this.player, target]);
	this.player.swapIdentity(target);
	this.data.originalUser.swapped = target.user;

	this.player.queueAlert("Someone has stolen your identity!");
}

function resetIdentities() {
	if (!this.data.swaps)
		return;

	for (let swap of this.data.swaps) {
		swap[0].swapIdentity(swap[1]);
		delete swap[1].swapped;
	}

	delete this.data.swaps;
	delete this.data.originalUser.swapped;
}