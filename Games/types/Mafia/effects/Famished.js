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
                let turkeyInGame = false;
                for (let player of this.game.players){
                    if (player.role.name === "Baker" && player.alive){
                        bakerAlive = true;
                    }
                    if (player.role.name === "Turkey"){
                        turkeyInGame = true;
                    }
                }

                if(bakerAlive && !turkeyInGame)
                    return;

                if (this.player.hasItem("Turkey")){
                    this.player.dropItem("Turkey", false);
                } else if (this.player.hasItem("Bread")){
                    this.player.dropItem("Bread", false);
                }else{
                    if (this.player.role.name !== "Turkey")
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
