const Card = require("../../Card");

module.exports = class KillTownOnDeath extends Card {

    constructor(role) {
        super(role);

        this.listeners = {
            "death": function (player, killer, killType, instant) {
                if (player !== this.player){
                    return;
                }
                for (let _player of this.game.players){
                    if (_player.alive && _player.role.name === this.player.role.name){
                        return;
                    }
                }
                
                for (let _player of this.game.players){
                    if(_player.alive && _player.role.alignment === "Village"){
                        _player.kill("basic", this.player, instant);
                    }
                }
            },
        };
    }
}
