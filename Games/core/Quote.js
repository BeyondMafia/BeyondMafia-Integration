module.exports = class Quote {

	constructor(info) {
		this.isQuote = true;
		this.game = info.game;
		this.sender = info.sender;
		this.messageId = info.messageId;
		this.meeting = info.meeting;
		this.fromMeetingId = info.fromMeetingId;
		this.fromState = info.fromState;
		this.versions = {};
		this.modified = false;
		this.cancel = false;
		this.timeSent = info.timeSent;
	}

	send() {
		this.timeSent = Date.now();
		this.recipients = this.meeting.getPlayers();

		if (this.sender) {
			var newVersion = this.sender.speakQuote(this);

			if (!newVersion)
				return;

			if (newVersion.modified)
				newVersion.modified = false;

			this.versions["*"] = newVersion;
		}
		else
			this.versions["*"] = this;

		this.meeting.messages.push(this);

		for (let player of this.recipients)
			player.hearQuote(this.versions["*"], this);

		if (this.game.isSpectatorMeeting(this.meeting))
			this.game.spectatorsHearQuote(this.versions["*"]);

		this.game.events.emit("message", this);
	}

	getMessageInfo(player) {
		var playerId, version, senderId;

		if (player == "spectator") {
			playerId = "spectator";
			version = this.versions["*"];
		}
		else if (player) {
			playerId = player.id;
			version = this.versions[playerId];
		}
		else if (this.versions["*"].parseForReview)
			version = this.versions["*"].parseForReview(this);
		else
			version = this;

		if (version.isServer)
			senderId = "server";
		else if (version.anonymous)
			senderId = "anonymous";
		else
			senderId = version.sender.id;

		return {
			isQuote: true,
			senderId: senderId,
			messageId: version.messageId,
			toMeetingId: version.meeting && version.meeting.id,
			fromMeetingId: version.fromMeetingId,
			fromState: version.fromState,
			time: version.timeSent,
			cancel: version.cancel
		};
	}

}