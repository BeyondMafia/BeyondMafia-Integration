const Card = require("../../Card");

module.exports = class WinAllProbed extends Card {
	
	constructor(role) {
		super(role);
		
		this.winCheck = {
			priority: 0,
			check: function(counts, winners, aliveCount){
				var probeCount = 0;
				for (let player of this.game.players){
					if (player.alive && player.effects.indexOf('Probe')){
						probeCount++;
					}
					if (probeCount == aliveCount){
						winners.addPlayer(this.player, this.name);
					}
				}
			}
		};
	}
}