const shortid = require("shortid");
const constants = require("../../data/constants");

module.exports = class Message {

    constructor(info) {
        this.id = info.id || shortid.generate();
        this.sender = info.sender;
        this.content = info.content;
        this.game = info.game;
        this.meeting = info.meeting;
        this.isServer = info.isServer;
        this.recipients = info.recipients;
        this.prefix = info.prefix;
        this.abilityName = info.abilityName;
        this.abilityTarget = info.abilityTarget;
        this.anonymous = info.anonymous;
        this.versions = {};
        this.timeSent = info.timeSent;
        this.quotable = info.quotable || true;
        this.modified = false;
    }

    send() {
        this.timeSent = Date.now();

        if (!this.meeting && !this.recipients) {
            this.globalAlert = true;
            this.recipients = this.game.players.array();
        }

        if (this.anonymous) {
            this.versions["*"] = new Message(this);
            this.anonymous = false;
        }
        else
            this.versions["*"] = this;

        if (this.sender) {
            var newVersion = this.sender.speak(this.versions["*"]);

            if (!newVersion)
                return;

            if (newVersion.modified)
                newVersion.modified = false;

            this.versions["*"] = newVersion;
        }

        if (this.meeting)
            this.meeting.messages.push(this);
        else
            this.game.history.addAlert(this);

        for (let player of this.versions["*"].recipients)
            player.hear(this.versions["*"], this);

        if (this.globalAlert || (this.meeting && this.game.isSpectatorMeeting(this.meeting)))
            this.game.spectatorsHear(this.versions["*"]);

        this.game.events.emit("message", this);
    }

    getMessageInfo(player) {
        var playerId, version, senderId;

        if (player == "spectator") {
            playerId = "spectator";
            version = this.versions["*"];

            if (version && !version.meeting && version.recipients && !version.globalAlert)
                return;
        }
        else if (player) {
            playerId = player.id;
            version = this.versions[playerId];

            if (!version)
                return;
        }
        else if (this.versions["*"].parseForReview)
            version = this.versions["*"].parseForReview(this);

        if (!version)
            version = this;

        if (version.isServer)
            senderId = "server";
        else if (version.anonymous)
            senderId = "anonymous";
        else if (version.sender)
            senderId = version.sender.id;
        else
            return;

        return this.parseMessageInfoObj(version, senderId);
    }

    parseMessageInfoObj(version, senderId) {
        return {
            id: version.id,
            senderId: senderId,
            content: version.content,
            meetingId: version.meeting && version.meeting.id,
            prefix: version.prefix,
            time: version.timeSent,
            quotable: version.quotable
        };
    }

}