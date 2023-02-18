const Card = require("../../Card");
const Random = require("../../../../../lib/Random");
const { PRIORITY_ITEM_GIVER_DEFAULT } = require("../../const/Priority");

module.exports = class TrickedWares extends Card {

    constructor(role) {
        super(role);

        this.actions = [
            {
                labels: ["giveItem"],
                priority: PRIORITY_ITEM_GIVER_DEFAULT - 1,
                run: function () {
                    if (this.game.getStateName() != "Night")
                        return;
                    
                    const item_targets = this.game.players.filter(p => p != this.player);
                    const target = Random.randArrayVal(item_targets);

                    var cursed = Random.randArrayVal([true, false]);
                    var items = ["Gun", "Armor", "Knife", "Snowball"];
                    var given_item = items[Math.floor(Math.random() * items.length)];
                    
                    switch (given_item) {
                        case "Gun":
                            if (cursed){
                                target.holdItem("Gun");
                            } else {
                                target.holdItem("Gun", {
                                    cursed: true
                                });          
                            }
                            target.queueAlert("You have received a gun!");
                            break;
                        case "Armor":
                            if (cursed){
                                target.holdItem("Armor");
                            } else {
                                target.holdItem("CursedArmor");
                            }
                            target.queueAlert("You have received armor!");
                            break;
                        case "Knife":
                            if (cursed){
                                target.holdItem("Knife");
                            } else {
                                target.holdItem("CursedKnife");
                            }
                            target.queueAlert("You have received a knife!");
                            break;
                        case "Snowball":
                            if (cursed){
                                target.holdItem("Snowball");
                            } else {
                                target.holdItem("CursedSnowball");
                            }
                            target.queueAlert("You have received a snowball!");
                            break;
                    }   
                }
            }
        ]
    }
};

