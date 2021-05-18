const shortid = require("shortid");
const Message = require("./Message");
const Quote = require("./Quote");
const Random = require("../../Random");
const ArrayHash = require("./ArrayHash");
const Agora = require("./Agora");
const constants = require("../../constants");

module.exports = class Meeting {

	constructor(game, name) {
		this.name = name;
		this.id = shortid.generate();
		this.game = game;
		this.events = game.events;

		/* Flags */
		this.group = false;
		this.speech = false;
		this.voting = false;
		this.instant = false;
		this.anonymous = false;
		this.noUnvote = false;
		this.multi = false;
		this.repeatable = false;
		this.ready = false;
		this.includeNo = false;
		this.noRecord = false;
		this.liveJoin = false;
		this.votesInvisible = game.setup.votesInvisible;
		this.mustAct = game.isMustAct();
		this.noAct = game.isNoAct();
		/***/

		this.inputType = "player";
		this.targets = { include: ["alive"], exclude: ["members"] };
		this.messages = [];
		this.members = new ArrayHash();
		this.leader = null;
		this.votes = {};
		this.voteRecord = [];
		this.voteVersions = {};
		this.totalVoters = 0;
		this.finished = false;
		this.multiMin = 0;
		this.multiMax = 0;
	}

	join(player, options) {
		options = options || {};

		// Set flags
		if (options.flags)
			for (let flag of options.flags)
				this[flag] = true;

		// Create member object
		const member = {
			id: player.id,
			player: player,
			voteWeight: options.voteWeight || 1,
			canVote: options.canVote != false && (player.alive || !options.passiveDead),
			canUnvote: options.canUnvote != false && (player.alive || !options.passiveDead),
			canTalk: options.canTalk != false && (player.alive || !options.passiveDead),
			visible: options.visible != false && (player.alive || !options.passiveDead),
			whileAlive: options.whileAlive != false,
			whileDead: options.whileDead,
			speechAbilities: options.speechAbilities || [],
			meetingName: options.meetingName,
			actionName: options.actionName,
			originalOptions: options,
			vcToken: this.game.voiceChat && Agora.generateToken(player.id, this.id)
		};

		this.members.push(member);

		if (options.leader)
			this.leader = player;

		if (member.canVote)
			this.totalVoters++;

		if (options.noGroup)
			this.group = false;

		if (options.targets)
			this.targets = options.targets;

		if (options.inputType)
			this.inputType = options.inputType;

		if (this.multi) {
			this.multiMin = options.multiMin;
			this.multiMax = options.multiMax;
		}

		// Create vote version for member
		if (this.voting)
			this.voteVersions[player.id] = { votes: {}, voteRecord: [] }

		if (this.game.setup.whispers && this.name != "Pregame") {
			member.speechAbilities.unshift({
				name: "Whisper",
				targets: { include: ["members"], exclude: ["self"] },
				targetType: "player",
				verb: "to"
			});
		}

		// Add meeting to player's history
		player.joinedMeeting(this);

		// Tell other players about the join
		if (this.liveJoin)
			for (let _member of this.members)
				if (_member != member)
					_member.player.sendMeetingMembers(this);

		return member;
	}

	leave(player) {
		if (this.finished)
			return;

		if (this.members[player.id].canVote) {
			delete this.votes[player.id];

			for (let memberId in this.voteVersions)
				delete this.voteVersions[memberId].votes[player.id];

			this.totalVoters--;
		}

		delete this.members[player.id];
		delete this.voteVersions[player.id];

		this.generateTargets();

		for (let member of this.members)
			member.player.sendMeeting(this);

		if (this.members.length <= 0)
			this.game.removeMeeting(this);

		player.leftMeeting(this);
	}

	init() {
		if (this.anonymous)
			for (let member of this.members)
				member.anonId = shortid.generate();

		this.generateTargets();
		this.events.emit("meeting", this);
	}

	cancel() {
		for (let member of this.members)
			this.leave(member.player);
	}

	getMembers() {
		var members = [];
		var i = 0;

		for (let member of this.members) {
			if (member.visible) {
				members.push({
					id: member.anonId || member.id,
					canVote: member.canVote
				});
			}
		}

		if (this.anonymous)
			members = Random.randomizeArray(members);

		return members;
	}

	getName(member) {
		return member.meetingName || this.name;
	}

	getActionName(member) {
		return member.actionName || this.actionName || this.getName(member);
	}

	getMeetingInfo(player) {
		var playerId = player && player.id;
		var member = this.members[playerId] || {};
		var votes = {};
		var voteRecord = [];

		if (this.voting) {
			if (member.id) {
				votes = this.voteVersions[member.id].votes;
				voteRecord = this.voteVersions[member.id].voteRecord;
			}
			else {
				votes = this.votes;
				voteRecord = this.voteRecord;
			}

			if (this.anonymous) {
				votes = { ...votes };
				voteRecord = [...voteRecord];

				for (let voterId in votes) {
					votes[this.members[voterId].anonId] = votes[voterId];
					delete votes[voterId];
				}

				for (let i in voteRecord) {
					let vote = { ...voteRecord[i] };
					vote.voterId = this.members[vote.voterId].anonId;
					voteRecord[i] = vote;
				}
			}
		}

		return {
			id: this.id,
			name: this.getName(member),
			actionName: this.getActionName(member),
			members: this.getMembers(),
			group: this.group,
			speech: this.speech,
			voting: this.voting,
			instant: this.instant,
			anonymous: this.anonymous,
			votesInvisible: this.votesInvisible,
			multi: this.multi,
			targets: this.targets,
			inputType: this.inputType,
			votes: votes,
			voteRecord: voteRecord,
			messages: this.messages.reduce((msgs, m) => {
				m = m.getMessageInfo(member.player);
				if (m) msgs.push(m);
				return msgs;
			}, []),
			canVote: member.canVote,
			canUnvote: member.canUnvote,
			canTalk: member.canTalk,
			speechAbilities: this.getSpeechAbilityInfo(member),
			vcToken: this.speech && !this.anonymous && member.canTalk && member.vcToken,
			amMember: member.id != null
		};
	}

	getSpeechAbilityInfo(member) {
		if (!member) return [];
		return member.speechAbilities;
	}

	getPlayers() {
		return this.members.map(m => m.player);
	}

	hasJoined(player) {
		for (let member of this.members)
			if (member.player == player)
				return true;
	}

	randomMember() {
		var member = Random.randArrayVal(this.members.array());
		return member;
	}

	generateTargets() {
		if (this.noAct)
			this.targets = ["*"];
		else if (this.inputType == "player" || this.inputType == "role") {
			if (!this.targetsDescription)
				this.targetsDescription = this.targets;

			if (!Array.isArray(this.targetsDescription)) {
				this.targets = this.parseTargetDefinitions(
					this.targetsDescription,
					this.inputType,
					this.game.players.array()
				);
			}

			if (!this.mustAct && !this.repeatable)
				this.targets.push("*");
		}
		else if (this.inputType == "boolean") {
			if (!this.mustAct || this.includeNo)
				this.targets = ["Yes", "No"];
			else
				this.targets = ["Yes"];
		}

		for (let member of this.members) {
			for (let ability of member.speechAbilities) {
				if (ability.targetType != "player" && ability.targetType != "role")
					continue;

				if (!ability.targetsDescription)
					ability.targetsDescription = ability.targets;

				if (!Array.isArray(ability.targetsDescription)) {
					ability.targets = this.parseTargetDefinitions(
						ability.targetsDescription,
						ability.targetType,
						this.getPlayers(),
						member.player
					);
				}
			}
		}

		for (let voterId in this.votes)
			if (this.targets.indexOf(this.votes[voterId]) == -1)
				delete this.votes[voterId];
	}

	parseTargetDefinitions(targets, targetType, players, self) {
		var includePlayer = {};
		var playerList = [];
		var roleList = {};
		var finalTargets = [];

		for (let player of players) {
			for (let type of ["include", "exclude"]) {
				if (!targets[type])
					continue;

				for (let tag of targets[type]) {
					let include = type == "include";

					switch (tag) {
						case "all":
							includePlayer[player.id] = include;
							break;
						case "self":
							if (player == self)
								includePlayer[player.id] = include;
							break;
						case "members":
							if (this.members[player.id])
								includePlayer[player.id] = include;
							break;
						case "alive":
							if (player.alive)
								includePlayer[player.id] = include;
							break;
						case "dead":
							if (!player.alive)
								includePlayer[player.id] = include;
							break;
						default:
							if (player.id == tag)
								includePlayer[player.id] = include;
							else if (player.role && player.role.name == tag)
								includePlayer[player.id] = include;
							else if (constants.alignments[this.game.type].indexOf(tag) != -1) {
								if (player.role.alignment == tag)
									includePlayer[player.id] = include;
							}
							else if (tag.indexOf("item:") == 0) {
								if (player.hasItem(tag.replace("item:", "")))
									includePlayer[player.id] = include;
							}
							else if (tag.indexOf("effect:") == 0) {
								if (player.hasEffect(tag.replace("effect:", "")))
									includePlayer[player.id] = include;
							}
							else if (tag.indexOf("itemProp:") == 0) {
								var parts = tag.match(/itemProp:(\w*):(\w*):(\w*)/);

								if (player.hasItemProp(parts[1], parts[2], parts[3]))
									includePlayer[player.id] = include;
							}
							else if (tag.indexOf("effectProp:") == 0) {
								var parts = tag.match(/effectProp:(\w*):(\w*):(\w*)/);

								if (player.hasEffectProp(parts[1], parts[2], parts[3]))
									includePlayer[player.id] = include;
							}
					}
				}
			}
		}

		for (let playerId in includePlayer) {
			if (includePlayer[playerId]) {
				if (targetType == "player")
					playerList.push(playerId);
				else
					//only get unique role names
					roleList[this.game.players[playerId].role.name] = true;
			}
		}

		if (targetType == "player")
			finalTargets = playerList;
		else
			finalTargets = Object.keys(roleList);

		return finalTargets;
	}

	vote(voter, selection) {
		var target;

		if (
			!this.members[voter.id] ||
			!this.members[voter.id].canVote ||
			!this.voting ||
			(this.finished && !this.repeatable)
		) {
			return false;
		}

		if (this.inputType != "text") {
			if (this.targets.indexOf(selection) != -1)
				target = selection;
			else if (selection == "*" && !this.mustAct && !this.repeatable) {
				if (this.inputType == "boolean")
					target = "No";
				else
					target = "*";
			}
		}
		else
			target = selection.slice(0, constants.maxGameTextInputLength);

		if (!target)
			return false;

		var vote = { voter, target, meeting: this };

		if (!this.multi)
			this.votes[voter.id] = target;
		else {
			if (!this.votes[voter.id])
				this.votes[voter.id] = [];

			if (this.votes[voter.id].length < this.multiMax)
				this.votes[voter.id].push(target);
			else
				return false;
		}

		this.voteRecord.push({
			type: "vote",
			voterId: voter.id,
			target,
			time: Date.now()
		});

		this.events.emit("vote", vote);

		for (let member of this.members) {
			if (!this.votesInvisible || member.id == voter.id) {
				let voteVersion = member.player.seeVote(vote);

				if (voteVersion) {
					let versionVotes = this.voteVersions[member.id].votes;
					let versionVote = versionVotes[voteVersion.voter.id];

					if (!this.multi)
						versionVotes[voteVersion.voter.id] = voteVersion.target;
					else {
						if (!versionVote)
							versionVote = versionVotes[voteVersion.voter.id] = [];

						versionVote.push(voteVersion.target)
					}

					this.voteVersions[member.id].voteRecord.push({
						type: "vote",
						voterId: voteVersion.voter.id,
						target: voteVersion.target,
						time: Date.now()
					});
				}
			}
		}

		if (this.game.isSpectatorMeeting(this))
			this.game.spectatorsSeeVote(vote);

		if (!this.multi)
			this.ready = Object.keys(this.votes).length == this.totalVoters;
		else
			this.ready = this.votes[voter.id].length >= this.multiMin;

		if (!this.instant && !this.repeatable)
			this.game.checkAllMeetingsReady();
		else if (this.ready)
			this.finish(true);

		return true;
	}

	unvote(voter, target) {
		const voteExists = this.votes[voter.id];
		const info = { voter, meeting: this, target };

		if (
			!this.members[voter.id] ||
			!this.members[voter.id].canUnvote ||
			this.noUnvote ||
			!voteExists ||
			(this.finished && !this.repeatable)
		) {
			return false;
		}

		if (!this.multi)
			delete this.votes[voter.id];
		else
			this.votes[voter.id] = this.votes[voter.id].filter(t => t != target);

		this.voteRecord.push({
			type: "unvote",
			voterId: voter.id,
			time: Date.now()
		});

		for (let member of this.members) {
			if (!this.votesInvisible || member.id == voter.id) {
				let infoVersion = member.player.seeUnvote(info);

				if (infoVersion) {
					let versionVotes = this.voteVersions[member.id].votes;
					let versionVote = versionVotes[infoVersion.voter.id];

					if (!this.multi)
						delete versionVotes[infoVersion.voter.id];
					else
						versionVotes[infoVersion.voter.id] = versionVote.filter(t => t != target);

					this.voteVersions[member.id].voteRecord.push({
						type: "unvote",
						voterId: infoVersion.voter.id,
						time: Date.now()
					});
				}
			}
		}

		if (this.game.isSpectatorMeeting(this))
			this.game.spectatorsSeeUnvote(info);

		if (!this.multi)
			this.ready = Object.keys(this.votes).length == this.totalVoters;
		else
			this.ready = this.votes[voter.id].length >= this.multiMin;

		return true;
	}

	finish(isVote) {
		if (!this.voting)
			return;

		if (this.finished && (!this.repeatable || !isVote))
			return;

		this.finished = true;

		var count = {};
		var highest = { targets: [], votes: 1 };
		var actor = this.leader;
		var finalTarget, voterIds;

		if (!this.multi) {
			// Count all votes
			for (let voterId in this.votes) {
				let member = this.members[voterId];
				let target = this.votes[voterId];

				if (!count[target])
					count[target] = 0;

				count[target] += member.voteWeight;
			}

			// Determine target with the most votes (ignores zero votes)
			for (let target in count) {
				if (count[target] > highest.votes)
					highest = { targets: [target], votes: count[target] };
				else if (count[target] == highest.votes)
					highest.targets.push(target);
			}

			if (highest.targets.length == 1)
				//Winning vote
				if (this.inputType == "boolean" && this.mustAct && this.includeNo) {
					if (highest.votes > this.totalVoters / 2)
						finalTarget = highest.targets[0];
					else
						finalTarget = "No";
				}
				else
					finalTarget = highest.targets[0];

			else if (highest.targets.length > 1) {
				//Tie vote
				if (this.inputType == "boolean")
					finalTarget = "No";
				else
					finalTarget = Random.randArrayVal(highest.targets);
			}
			else {
				//No votes
				if (this.mustAct && !this.includeNo)
					finalTarget = Random.randArrayVal(this.targets);
				else if (this.inputType == "boolean")
					finalTarget = "No";
				else
					finalTarget = "*";
			}
		}
		else {
			var selections = Object.values(this.votes)[0] || [];
			finalTarget = selections;

			if (selections.length < this.multiMin) {
				if (!this.mustAct)
					finalTarget = "*";
				else {
					var unselectedTargets = this.targets.filter(t => selections.indexOf(t) == -1);

					while (selections.length < this.multiMin)
						selections.push(Random.randArrayVal(unselectedTargets, true));
				}
			}
		}

		if (!finalTarget || finalTarget == "*")
			return;

		if (this.inputType == "player") {
			if (!this.multi)
				finalTarget = this.game.players[finalTarget];
			else
				finalTarget = finalTarget.map(target => this.game.players[target]);
		}

		voterIds = Object.keys(this.votes);

		if (!actor && voterIds.length > 0)
			// First player to vote is the actor
			actor = this.game.getPlayer(voterIds[0], true);
		else if (!actor)
			// Must act and no votes, a random player acts
			actor = this.randomMember().player;

		this.finalTarget = finalTarget;
		actor.act(finalTarget, this);
	}

	speak(message) {
		var member = this.members[message.sender.id];

		if (
			!member ||
			!this.speech ||
			!member.canTalk ||
			(!(this.members.length > 1) && this.name != "Pregame")
		) {
			return;
		}

		if (
			message.abilityName == "Whisper" &&
			this.game.setup.whispers &&
			this.name != "Pregame" &&
			!this.anonymous
		) {
			var recipientMember = this.members[message.abilityTarget];

			if (!recipientMember)
				return;

			message.recipients = [recipientMember.player, message.sender];
			message.prefix = `whispers to ${recipientMember.player.name}`;
		}

		if (!message.recipients)
			message.recipients = this.getPlayers();

		if (message.recipients.length == 0)
			return;

		message = new Message({
			sender: message.sender,
			content: message.content,
			game: this.game,
			meeting: this,
			recipients: message.recipients,
			prefix: message.prefix,
			abilityName: message.abilityName,
			abilityTarget: message.abilityTarget,
			anonymous: this.anonymous
		});

		message.send();
	}

	quote(sender, quote) {
		var member = this.members[sender.id];

		if (
			!member ||
			constants.noQuotes[this.game.type] ||
			!this.speech ||
			!member.canTalk ||
			(!(this.members.length > 1) && this.name != "Pregame") ||
			quote.messageId.length < 7 ||
			quote.messageId.length > 14
		) {
			return;
		}

		var quote = new Quote({
			game: this.game,
			sender: sender,
			messageId: quote.messageId,
			meeting: this,
			fromMeetingId: quote.fromMeetingId,
			fromState: quote.fromState,
			anonymous: this.anonymous
		});

		quote.send();
	}

	typing(playerId, isTyping) {
		var member = this.members[playerId];

		if (member && this.speech && !this.anonymous && member.canTalk) {
			for (let _playerId in this.members) {
				this.members[_playerId].player.send("typing", {
					playerId,
					meetingId: isTyping ? this.id : null
				});
			}
		}
	}

	sendAlert(message) {
		message = new Message({
			content: message,
			game: this.game,
			meeting: this,
			recipients: this.getPlayers(),
			isServer: true
		});

		message.send();
	}

	checkReady() {
		return this.ready || !this.voting;
	}

}
