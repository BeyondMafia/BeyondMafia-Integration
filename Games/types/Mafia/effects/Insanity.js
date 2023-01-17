const Effect = require("../Effect");
const Random = require("../../../../lib/Random");

module.exports = class Insanity extends Effect {

    constructor() {
        super("Insanity");
    }

    speak(message) {
        message.content = this.makeStrInsane(message.content);
        message.parseForReview = this.parseForReview;
        message.modified = true;
    }

    speakQuote(quote) {
        quote.cancel = true;
    }

    parseForReview(message) {
        message.content = message.versions["*"].content;
        return message;
    }

    makeStrInsane(str) {
        var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        var originalLength = str.length;

        str = "";

        for (let i = 0; i < originalLength; i++) {
            let isSpace = Random.randFloat();

            if (isSpace < 0.2)
                str += " ";
            else
                str += chars[Random.randInt(0, chars.length - 1)];
        }

        return str;
    }

};