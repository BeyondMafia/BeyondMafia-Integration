const Card = require("../../Card");

module.exports = class Prognosticate extends Card {

    constructor(role) {
        super(role);

        this.meetings = {
            "Predict End": {
                actionName: "Predict End Phase",
                states: ["Night"],
                flags: ["voting"],
                inputType: "alignment",
                targets: ["Night", "Day"],
                action: {
                    run: function () {
                        this.actor.role.data.predictPhase = this.target;
                    }
                },
                shouldMeet: function(){
                    return !this.data.prediction;
                }
            },
            "Predict End": {
                actionName: "Predict End Number",
                states: ["Night"],
                flags: ["voting"],
                inputType: "text",
                textOptions: {
                    minLength: 1,
                    maxLength: 2,
                    numberOnly: true,
                    submit: "Predict"
                },
                action: {
                    run: function () {
                        this.actor.role.data.predictPhase = this.target;
                    }
                },
                shouldMeet: function(){
                    return !this.data.prediction;
                }
            }
        };
    }

}
