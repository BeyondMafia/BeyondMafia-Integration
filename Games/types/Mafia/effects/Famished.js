const Effect = require("../Effect");
const Action = require("../Action");

module.exports = class Famished extends Effect {

    constructor() {
        super("Famished");

        this.listeners = {
            "actionsNext": function () {
                if (!this.player.alive)
                    return;

                let bakerAlive = false;
                for (let player of this.game.players){
                    if (player.alive && player.role.name === "Baker"){
                        bakerAlive = true;
                        break;
                    }
                }

                if(bakerAlive)
                    return;

                if (this.player.hasItem("Bread")){
                    this.player.dropItem("Bread", false);
                } else if (this.player.hasItem("Orange")){
                    this.player.dropItem("Orange", false);
                }else{
                    this.game.queueAction(new Action({
                        actor: this.player,
                        target: this.player,
                        game: this.player.game,
                        power: 5,
                        labels: ["kill", "famine"],
                        run: function () {
                            if (this.dominates())
                                this.target.kill("basic", this.actor);
                        }
                    }));
                }
            }
        };
    }
};
