const Item = require("../Item");

module.exports = class Orange extends Item {

    constructor(reveal) {
        super("Orange");

        this.reveal = reveal;
        this.meetings = {
            "Visit Hot Springs": {
                actionName: "Visit the hot springs tonight?",
                states: ["Day"],
                flags: ["voting"],
                inputType: "boolean",
                action: {
                    labels: ["springs", "orange"],
                    priority: -10,
                    item: this
                }
            },

			"Hot Springs": {
				actionName: "Enjoy the spa",
				states: ["Night"],
				flags: ["group", "speech", "voting", "anonymous"],
				inputType: "boolean",
			}
        };
    }

    shouldDisableMeeting(name, options) {
        if (name != "Hot Springs")
            return true;
    }

}