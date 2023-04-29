const Player = require("./Player");
const Spectator = require("./Spectator");
const Message = require("./Message");
const History = require("./History");
const Queue = require("./Queue");
const PregameMeeting = require("./PregameMeeting");
const PregameReadyMeeting = require("./PregameReadyMeeting");
const Timer = require("./Timer");
const Random = require("../../lib/Random");
const Utils = require("./Utils");
const ArrayHash = require("./ArrayHash");
const Action = require("./Action");
const Winners = require("./Winners");
const { games, deprecationCheck } = require("../games");
const events = require("events");
const models = require("../../db/models");
const redis = require("../../modules/redis");
const roleData = require("../..//data/roles");
const logger = require("../../modules/logging")("games");
const constants = require("../../data/constants");
const routeUtils = require("../../routes/utils");
const PostgameMeeting = require("./PostgameMeeting");
const VegKickMeeting = require("./VegKickMeeting");

module.exports = class Game {

    constructor(options) {
        this.id = options.id;
        this.hostId = options.hostId;
        this.port = options.port;
        this.Player = Player;
        this.events = new events();
        this.stateLengths = options.settings.stateLengths;
        this.states = [
            {
                name: "Postgame"
            },
            {
                name: "Pregame"
            }
        ];
        this.currentState = -1;
        this.stateOffset = 0;
        this.stateIndexRecord = [];
        this.stateEvents = {};
        this.stateEventMessages = {};
        this.setup = options.settings.setup;
        this.lobby = options.settings.lobby;
        this.private = options.settings.private;
        this.guests = options.settings.guests;
        this.ranked = options.settings.ranked;
        this.spectating = options.settings.spectating;
        this.voiceChat = options.settings.voiceChat;
        this.readyCheck = options.settings.readyCheck;
        this.readyCountdownLength = options.settings.readyCountdownLength != null ? options.settings.readyCountdownLength : 30000;
        this.pregameCountdownLength = options.settings.pregameCountdownLength != null ? options.settings.pregameCountdownLength : 10000;
        this.vegKickCountdownLength = options.settings.vegKickCountdownLength != null ? options.settings.vegKickCountdownLength : 120000;
        this.postgameLength = 1000 * 60 * 2;
        this.players = new ArrayHash();
        this.playersGone = {};
        this.spectators = [];
        this.spectatorLimit = constants.maxSpectators;
        this.history = new History(this);
        this.spectatorHistory = new History(this, "spectator");
        this.spectatorMeetFilter = { "*": true };
        this.timers = {};
        this.actions = [
            new Queue()
        ];
        this.alertQueue = new Queue();
        this.deathQueue = new Queue();
        this.revealQueue = new Queue();
        this.pregame = this.createMeeting(PregameMeeting);
        this.meetings = {
            [Symbol.iterator]: () => {
                var i = 0;
                var meetings = this.getMeetings();

                return {
                    next: () => {
                        if (i >= meetings.length)
                            return { done: true };

                        return { value: meetings[i++], done: false }
                    }
                };
            }
        };
        this.processingActionQueue = false;
        this.banned = {};
        this.createTime = Date.now();
        this.finished = false;
        this.rehostId = options.settings.rehostId;
        this.scheduled = options.settings.scheduled;
        this.timeouts = [];
        this.isTest = options.isTest;
    }

    async init() {
        try {
            await redis.createGame(this.id, {
                type: this.type,
                port: this.port,
                status: "Open",
                hostId: this.hostId,
                lobby: this.lobby,
                settings: {
                    setup: this.setup.id,
                    total: this.setup.total,
                    private: this.private,
                    guests: this.guests,
                    ranked: this.ranked,
                    rehostId: this.rehostId,
                    scheduled: this.scheduled,
                    spectating: this.spectating,
                    voiceChat: this.voiceChat,
                    readyCheck: this.readyCheck,
                    stateLengths: this.stateLengths,
                    gameTypeOptions: this.getGameTypeOptions()
                },
                createTime: this.createTime
            });

            if (!this.scheduled)
                await redis.joinGame(this.hostId, this.id, this.ranked);
            else {
                await redis.setHostingScheduled(this.hostId, this.id);
                this.queueScheduleNotifications();
            }
        }
        catch (e) {
            logger.error(e);
        }
    }

    async cancel() {
        for (let timeout of this.timeouts)
            clearTimeout(timeout);

        delete games[this.id];
        await redis.deleteGame(this.id);
    }

    broadcast(eventName, data) {
        for (let player of this.players)
            player.send(eventName, data);

        for (let spectator of this.spectators)
            spectator.send(eventName, data);
    }

    sendAlert(message, recipients) {
        message = new Message({
            content: message,
            recipients: recipients,
            game: this,
            isServer: true
        });

        message.send();
    }

    processAlertQueue() {
        for (let item of this.alertQueue)
            this.sendAlert(item.message, item.recipients);

        this.alertQueue.empty();
    }

    queueAlert(message, priority, recipients) {
        priority = priority || 0;
        this.alertQueue.enqueue({ message, priority, recipients });
    }

    processDeathQueue() {
        for (let item of this.deathQueue) {
            this.recordDead(item.player, item.dead);

            if (item.dead && !item.player.alive)
                this.broadcast("death", item.player.id);
            else if (!item.dead && item.player.alive)
                this.broadcast("revival", item.player.id);
        }

        this.deathQueue.empty();
    }

    queueDeath(player) {
        player.alive = false;
        this.deathQueue.enqueue({ player, dead: true });
    }

    queueRevival(player) {
        player.alive = true;
        this.deathQueue.enqueue({ player, dead: false });
    }

    processRevealQueue() {
        for (let item of this.revealQueue) {
            this.recordRole(item.player, item.appearance);
            this.broadcast("reveal", { playerId: item.player.id, role: item.appearance });
        }

        this.revealQueue.empty();
    }

    queueReveal(player, appearance) {
        this.revealQueue.enqueue({ player, appearance });
    }

    getPlayer(playerId) {
        return this.players[playerId];
    }

    getMeeting(meetingId, state) {
        state = state == null ? this.currentState : state;
        return this.history.states[state].meetings[meetingId];
    }

    getMeetingByName(name) {
        return this.history.getMeetings().filter(m => m.name == name)[0];
    }

    getMeetings() {
        return this.history.getMeetings();
    }

    getSetupInfo() {
        return this.setup;
    }

    async userJoin(user, isBot) {
        try {
            var currentGame;

            if (!isBot)
                currentGame = await redis.inGame(user.id);

            // Check if user is already in a different game
            if (currentGame && currentGame != this.id) {
                user.send("error", "You must leave your current game before joining a new one.");
                user.socket.terminate();
                return;
            }

            var player;

            // Find existing player in this game with same user
            if (!isBot) {
                for (let p of this.players) {
                    if (p.user.id == user.id) {
                        player = p;
                        break;
                    }
                }
            }
            else {
                for (let p of this.players) {
                    if (user.guestId && p.user.guestId && p.user.guestId == user.guestId) {
                        player = p;
                        break;
                    }
                }
            }

            // Reconnect to game if user is already in it
            if (player && !player.left) {
                player = player.setUser(user);
                this.sendAllGameInfo(player);
                player.send("loaded");
                return;
            }

            // Join the game as a new player if possible
            await this.joinMutexLock();
            if (
                !player &&
                this.currentState == -1 &&
                this.players.length < this.setup.total &&
                !this.banned[user.id]
            ) {
                await redis.joinGame(user.id, this.id, this.ranked);

                player = new this.Player(user, this, isBot);
                player.init();

                if (this.playersGone[user.id]) {
                    player.id = this.playersGone[user.id].id;
                    delete this.playersGone[user.id];
                }

                this.players.push(player);
                this.joinMutexUnlock();
                this.sendPlayerJoin(player);
                this.pregame.join(player);
                this.sendAllGameInfo(player);
                player.send("loaded");
                this.checkGameStart();
                return;
            }
            else
                this.joinMutexUnlock();

            const canSpectateAny = await routeUtils.verifyPermission(user.id, "canSpectateAny");

            // Check if spectating is allowed
            if (!this.spectating && !canSpectateAny) {
                user.send("error", "Spectating is not enabled for this game");
                return;
            }

            var spectator;

            // Find existing spectator with same user
            for (let s of this.spectators) {
                if (s.user.id == user.id) {
                    spectator = s;
                    break;
                }
            }

            // Reconnect if already a spectator
            if (spectator) {
                spectator.setUser(user);
                this.sendAllGameInfo(spectator);
                spectator.send("loaded");
                return;
            }

            // Check if spectator limit is reached
            if (this.spectators.length >= this.spectatorLimit && !canSpectateAny) {
                user.send("error", "Spectator limit reached");
                return;
            }

            // Join as a new spectator
            spectator = new Spectator(user, this);
            spectator.init();

            this.spectators.push(spectator);
            this.sendAllGameInfo(spectator);
            spectator.send("loaded");

            this.broadcast("spectatorCount", this.spectators.length);
        }
        catch (e) {
            logger.error(e);
        }
    }

    joinMutexLock() {
        return new Promise((res, rej) => {
            if (!this.joinMutex) {
                this.joinMutex = true;
                res();
            } else {
                var count = 0;
                var lockInt = setInterval(() => {
                    if (!this.joinMutex) {
                        this.joinMutex = true;
                        clearInterval(lockInt);
                        res();
                    }
                    else {
                        count++;

                        if (count == 100)
                            rej();
                    }
                }, 100);
            }
        });
    }

    joinMutexUnlock() {
        this.joinMutex = false;
    }

    async userLeave(userId) {
        var player;

        for (let p of this.players) {
            if (p.user.id == userId) {
                player = p;
                break;
            }
        }

        if (!player && userId != this.hostId)
            return;
        else if (!player) {
            await redis.leaveGame(userId);

            if (this.players.length == 0) {
                delete games[this.id];
                await redis.deleteGame(this.id);
            }

            return
        }

        this.playerLeave(player);

        if (player.alive)
            this.sendAlert(`${player.name} left the game.`);
    }

    async playerLeave(player) {
        player.send("left");
        player.left = true;
        player.user.disconnect();

        if (!this.started && this.players[player.id]) {
            this.cancelReadyCheck();
            this.pregame.leave(player);
            this.broadcast("playerLeave", player.id);

            delete this.players[player.id];
            this.playersGone[player.user.id] = this.createPlayerGoneObj(player);

            if (this.players.length == 0) {
                await this.cancel();
                return;
            }
        }
        else if (!this.postgameOver && this.players[player.id]) {
            var remainingPlayer = false;

            for (let player of this.players) {
                if (!player.left) {
                    remainingPlayer = true;
                    break;
                }
            }

            if (!remainingPlayer) {
                await this.onAllPlayersLeft();
                return;
            }
        }

        // In the event of a guiser swap, the userId that is needed to leave is
        // the target. However, the `player` in this game is the still alive disguiser
        // Therefore, if the swapped user is not null, then we need to use that person's ID
        let userIdToLeave = player.user.id;
        if (player.user.swapped) {
            userIdToLeave = player.user.swapped.id;
        }
        await redis.leaveGame(userIdToLeave);
    }

    async onAllPlayersLeft() {
        if (!this.finished)
            this.immediateEnd();
        else if (!this.postgameOver)
            this.endPostgame();
    }

    async vegPlayer(player) {
        if (player.left)
            return;

        var ranked = this.ranked;
        this.ranked = false;

        // Set priority to -999 to avoid roles that switch actions
        // forcing active player to veg. Do not change this.
        // Happened with witch/cyclist/driver.
        this.queueAction(new Action({
            actor: player,
            target: player,
            priority: -999,
            game: this,
            labels: ["hidden", "absolute"],
            run: function () {
                this.target.kill("veg", this.actor);

                if (ranked)
                    this.game.queueAlert("This game is now unranked");
            }
        }));
    }

    createPlayerGoneObj(player) {
        return {
            id: player.id,
            userId: player.user.id,
            name: player.name,
            avatar: player.user.avatar,
            emojis: player.user.emojis,
            textColor: player.user.textColor,
            nameColor: player.user.nameColor,
            alive: player.alive,
            left: true
        };
    }

    removeSpectator(spectator) {
        this.spectators.splice(this.spectators.indexOf(spectator), 1);
        this.broadcast("spectatorCount", this.spectators.length);
    }

    async kickPlayer(player, permanent) {
        if (this.started)
            return;

        if (permanent)
            this.banned[player.user.id] = true;

        await this.playerLeave(player);
    }

    alivePlayers() {
        return this.players.filter(p => p.alive);
    }

    getAllPlayerInfo(recipient) {
        var allPlayerInfo = {};

        for (let player of this.players)
            allPlayerInfo[player.id] = player.getPlayerInfo(recipient);

        for (let userId in this.playersGone) {
            let player = this.playersGone[userId];
            allPlayerInfo[player.id] = player;
        }

        return allPlayerInfo;
    }

    sendAllGameInfo(player) {
        player.sendSelf();
        player.send("players", this.getAllPlayerInfo(player));
        player.send("options", {
            lobby: this.lobby,
            private: this.private,
            ranked: this.ranked,
            spectating: this.spectating,
            guests: this.guests,
            voiceChat: this.voiceChat,
            stateLengths: this.stateLengths,
            gameTypeOptions: this.getGameTypeOptions()
        });
        player.sendHistory();
        player.sendStateInfo();
        player.send("stateEvents", Object.keys(this.stateEvents));
        player.sendSelfWill();
        player.send("setup", this.getSetupInfo());
        player.send("emojis", this.emojis);

        if (!player.user.playedGame && !player.isBot)
            player.send("firstGame");

        if (player.user.dev && !player.isBot)
            player.send("dev");

        this.sendTimersToPlayer(player);
        this.syncPlayerTimers(player);
    }

    sendPlayerJoin(newPlayer) {
        for (let player of this.players)
            if (player != newPlayer)
                player.send("playerJoin", newPlayer.getPlayerInfo(player));
        
        this.sendAlert(`${newPlayer.name} has joined.`);        
    }

    sendStateEventMessages() {
        for (let stateEvent in this.stateEvents) {
            var message = this.stateEventMessages(stateEvent);

            if (this.stateEvents[stateEvent] && message)
                this.queueAlert(message);
        }
    }

    checkGameStart() {
        if (this.players.length == this.setup.total) {
            if (!this.isTest) {
                if (this.readyCheck)
                    this.startReadyCheck();
                else
                    this.startPregameCountdown();
            }
            else
                this.start();
        }
    }

    startReadyCheck() {
        this.readyMeeting = this.createMeeting(PregameReadyMeeting);

        for (let player of this.players)
            this.readyMeeting.join(player);

        this.readyMeeting.init();

        for (let player of this.players)
            player.sendMeeting(this.readyMeeting);

        this.createTimer("pregameCountdown", this.readyCountdownLength, () => this.failReadyCheck());
        this.sendAlert("Game filled, @everyone please ready up to start the game.");
    }

    cancelReadyCheck() {
        this.clearTimer("pregameCountdown");

        if (this.readyMeeting)
            this.readyMeeting.cancel();
    }

    failReadyCheck() {
        for (let member of this.readyMeeting.members) {
            if (!member.ready) {
                this.kickPlayer(member.player);
                this.sendAlert(`${member.player.name} was kicked for inactivity.`);
            }
        }

        this.cancelReadyCheck();
    }

    startPregameCountdown() {
        this.clearTimer("pregameCountdown");
        this.createTimer("pregameCountdown", this.pregameCountdownLength, () => this.start());
    }

    start() {
        // Set game in progress in redis db
        redis.setGameStatus(this.id, "In Progress");

        // Record start time
        this.startTime = Date.now();

        // Tell clients the game started, assign roles, and move to the next state
        this.started = true;
        this.assignRoles();
        this.broadcast("start");
        this.events.emit("start");

        // Got to initial state
        this.calculateStateOffset();
        this.gotoNextState();
    }

    generateClosedRoleset() {
        var roleset = {};
        var rolesByAlignment = {};

        for (let role in this.setup.roles[0]) {
            let roleName = role.split(":")[0];
            let alignment = roleData[this.type][roleName].alignment;

            if (!rolesByAlignment[alignment])
                rolesByAlignment[alignment] = [];

            for (let i = 0; i < this.setup.roles[0][role]; i++)
                rolesByAlignment[alignment].push(role);
        }

        for (let alignment in rolesByAlignment) {
            for (let i = 0; i < this.setup.count[alignment]; i++) {
                let role = Random.randArrayVal(rolesByAlignment[alignment]);

                if (this.setup.unique)
                    rolesByAlignment[alignment] = rolesByAlignment[alignment].filter(_role => _role != role);

                if (roleset[role] == null)
                    roleset[role] = 0;

                roleset[role]++;
            }
        }

        return roleset;
    }

    generateRoleset() {
        var roleset;

        if (!this.setup.closed)
            roleset = { ...Random.randArrayVal(this.setup.roles) };
        else
            roleset = this.generateClosedRoleset();

        return roleset;
    }

    assignRoles() {
        var roleset = this.generateRoleset();
        var randomPlayers = Random.randomizeArray(this.players.array());

        var i = 0;
        this.originalRoles = {};

        for (let roleName in roleset) {
            for (let j = 0; j < roleset[roleName]; j++) {
                let player = randomPlayers[i];
                player.setRole(roleName);
                this.originalRoles[player.id] = roleName;
                i++;
            }
        }

        this.events.emit("rolesAssigned");
    }

    getRoleClass(roleName) {
        const alignment = roleData[this.type][roleName].alignment;
        roleName = Utils.pascalCase(roleName);
        return Utils.importGameClass(this.type, "roles", `${alignment}/${roleName}`);
    }

    getMeetingClass(meetingType) {
        if (!meetingType)
            return Utils.importGameClass(this.type, "core", "Meeting");

        meetingType = Utils.pascalCase(meetingType);
        return Utils.importGameClass(this.type, "meetings", `${meetingType}`);
    }

    calculateStateOffset() {
        if (!this.setup.startState)
            return;

        for (let i = 2; i < this.states.length; i++) {
            if (this.states[i].name == this.setup.startState) {
                this.stateOffset = i - 2;
                return;
            }
        }
    }

    getRoleAlignment(role) {
        return roleData[this.type][role.split(":")[0]].alignment;
    }

    recordRole(player, appearance) {
        for (let _player of this.players)
            _player.history.recordRole(player, appearance);

        this.spectatorHistory.recordRole(player, appearance);
    }

    recordDead(player, dead) {
        for (let _player of this.players)
            _player.history.recordDead(player, dead);

        this.spectatorHistory.recordDead(player, dead);
    }

    gotoNextState() {
        var stateInfo = this.getStateInfo();

        // Clear current timers
        this.clearTimers();

        // Finish all meetings and take actions
        this.finishMeetings();

        // Take snapshot of roles
        this.history.recordAllRoles();

        // Take snapshot of dead players
        this.history.recordAllDead();

        // Check if states will be skipped
        var [_, skipped] = this.getNextStateIndex();

        // Do actions
        if (!stateInfo.delayActions || skipped > 0)
            this.processActionQueue();

        // Check win conditions
        if (this.checkGameEnd())
            return;

        // Set next state
        this.incrementState();
        this.stateEvents = {};
        stateInfo = this.getStateInfo();

        // Tell clients the new state
        this.addStateToHistories(stateInfo.name);

        this.broadcastState();
        this.events.emit("state", stateInfo);

        // Send state events
        this.addStateEventsToHistories(this.stateEvents);
        this.addStateExtraInfoToHistories(stateInfo.extraInfo);
        this.broadcast("stateEvents", Object.keys(this.stateEvents));
        this.events.emit("stateEvents", this.stateEvents);
        this.sendStateEventMessages();

        // Check for inactivity
        this.inactivityCheck();

        // Make meetings and send deaths, reveals, alerts
        this.processDeathQueue();
        this.processRevealQueue();
        this.makeMeetings();
        this.processAlertQueue();
        this.events.emit("meetingsMade");

        this.vegKickMeeting = undefined;

        // Create next state timer
        this.createNextStateTimer(stateInfo);
    }

    createNextStateTimer(stateInfo) {
        if (this.isTest) {
            this.createTimer("main", stateInfo.length, () => this.gotoNextState());
        }
        else {
            this.createTimer("main", stateInfo.length, () => this.checkVeg());
        }
        this.checkAllMeetingsReady();
    }

    checkVeg() {
        this.clearTimer("main");
        this.clearTimer("secondary");

        this.vegKickMeeting = this.createMeeting(VegKickMeeting, "vegKickMeeting");

        for (let player of this.players) {
            if (!player.alive) {
                continue
            }

            let canKick = player.hasVotedInAllMeetings();
            this.vegKickMeeting.join(player, canKick);
        }

        this.vegKickMeeting.init();
        this.vegKickMeeting.getKickState();

        for (let player of this.players) {
            player.sendMeeting(this.vegKickMeeting);
        }
        this.checkAllMeetingsReady();
    }

    broadcastState() {
        this.broadcast("state", this.getStateInfo());
    }

    addStateToHistories(name, state) {
        this.history.addState(name, state);
        this.spectatorHistory.addState(name, state);

        for (let player of this.players)
            player.addStateToHistory(name, state);
    }

    addStateEventsToHistories(events, state) {
        this.history.addStateEvents(events, state);
        this.spectatorHistory.addStateEvents(events, state);

        for (let player of this.players)
            player.addStateEventsToHistory(events, state);
    }

    addStateExtraInfoToHistories(extraInfo, state) {
        this.history.addStateExtraInfo(extraInfo, state);
        this.spectatorHistory.addStateExtraInfo(extraInfo, state);

        for (let player of this.players)
            player.addStateExtraInfoToHistory(extraInfo, state);
    }

    incrementState() {
        this.currentState++;

        var [index, skipped] = this.getNextStateIndex();
        this.stateIndexRecord.push(index);
        return skipped;
    }

    getNextStateIndex() {
        var lastStateIndex = this.stateIndexRecord[this.stateIndexRecord.length - 1];
        var skipped = -1;
        var nextStateIndex, shouldSkip;

        if (lastStateIndex == null)
            nextStateIndex = 2 + this.stateOffset - 1;
        else
            nextStateIndex = lastStateIndex;

        do {
            nextStateIndex++;
            skipped++;

            if (nextStateIndex == this.states.length)
                nextStateIndex = 2;

            let skipChecks = this.states[nextStateIndex].skipChecks;

            if (skipChecks != null && skipChecks.length > 0) {
                shouldSkip = true;

                for (let skipCheck of skipChecks)
                    shouldSkip = shouldSkip && skipCheck();
            }
            else
                shouldSkip = false;
        } while (shouldSkip);

        return [nextStateIndex, skipped];
    }

    getStateInfo(state) {
        var info;
        state = state || this.currentState;

        if (state >= 0)
            info = this.states[this.stateIndexRecord[state]];
        else
            info = this.states[state + 2];

        info.id = state;
        return info;
    }

    getPrevStateInfo() {
        return this.getStateInfo(this.currentState - 1);
    }

    getStateName(state) {
        var info = this.getStateInfo(state);
        return info.name.replace(/[0-9]*/g, "").trim();
    }

    inactivityCheck() { }

    getTime() {
        if (!this.started) return 0;

        return Math.floor(Date.now() - this.startTime);
    }

    createTimer(name, delay, then, clients) {
        this.timers[name] = new Timer({
            name,
            delay,
            then,
            game: this,
            clients
        });
        this.timers[name].start();
    }

    clearTimer(timer) {
        if (typeof timer == "string")
            timer = this.timers[timer];

        if (!timer) return;

        timer.clear();
        delete this.timers[timer.name];
    }

    clearTimers() {
        for (let timerName in this.timers)
            this.clearTimer(timerName);
    }

    syncPlayerTimers(player) {
        for (let timerName in this.timers)
            this.timers[timerName].syncClient(player);
    }

    sendTimersToPlayer(player) {
        for (let timerName in this.timers)
            if (this.timers[timerName].clients.indexOf(player) != -1)
                this.timers[timerName].sendInfoToClient(player);
    }

    addStateType(name, index, length, delayActions, shouldSkip) {
        var existingState;

        for (let state of this.states) {
            if (state.name == name) {
                existingState = state;
                break;
            }
        }

        if (!existingState) {
            this.states.splice(index, 0, {
                name,
                length,
                delayActions,
                skipChecks: [shouldSkip]
            });
        }
        else {
            if (existingState.skipChecks == null)
                existingState.skipChecks = [];

            existingState.skipChecks.push(shouldSkip);
        }
    }

    removeStateType(name) {
        for (let i in this.states) {
            if (this.states[i].name == name) {
                this.states.splice(i, 1);
                break;
            }
        }
    }

    setStateLength(name, length) {
        for (let i in this.states) {
            if (this.states[i].name == name) {
                this.states[i].length = length;
                break;
            }
        }
    }

    setStateDelayActions(name, delayActions) {
        for (let i in this.states) {
            if (this.states[i].name == name) {
                this.states[i].delayActions = delayActions;
                break;
            }
        }
    }

    setStateShouldSkip(name, shouldSkip) {
        for (let i in this.states) {
            if (this.states[i].name == name) {
                if (this.states[i].shouldSkip == null)
                    this.states[i].shouldSkip = [];

                this.states[i].shouldSkip.push(shouldSkip);
                break;
            }
        }
    }


    createMeeting(type, name) {
        var meeting = (typeof type) == "function" ? type : this.getMeetingClass(type);
        meeting = new meeting(this, name);

        this.history.addMeeting(meeting);

        if (this.isSpectatorMeeting(meeting))
            this.spectatorHistory.addMeeting(meeting);

        return meeting;
    }

    makeMeetings() {
        for (let player of this.players)
            player.meet();

        this.initMeetings();
        this.sendMeetings();
    }

    initMeetings() {
        for (let meeting of this.meetings)
            meeting.init();
    }

    sendMeetings(players) {
        players = players || this.players;
        for (let player of players)
            player.sendMeetings();

        this.sendSpectatorMeetings();
    }

    removeMeeting(meeting) {
        this.history.removeMeeting(meeting);
    }

    checkAllMeetingsReady() {
        var allReady = true;

        for (let meeting of this.meetings) {
            let extraConditionDuringKicks = true;
            if (this.vegKickMeeting !== undefined) {
                extraConditionDuringKicks = meeting.name !== "Vote Kick" && !meeting.noVeg
            }

            // during kicks, we need to exclude the votekick and noveg meetings
            if (!meeting.ready && extraConditionDuringKicks) {
                allReady = false;
                break;
            }
        }

        if (allReady)
            this.gotoNextState();
    }

    finishMeetings() {
        for (let meeting of this.meetings)
            if (!meeting.finished)
                meeting.finish();
    }

    isSpectatorMeeting(meeting) {
        return (
            this.spectatorMeetFilter[meeting.name] ||
            (this.spectatorMeetFilter["*"] && this.spectatorMeetFilter[meeting.name] != false)
        );
    }

    sendSpectatorMeetings() {
        for (let spectator of this.spectators)
            spectator.sendMeetings();
    }

    spectatorsHear(message) {
        for (let spectator of this.spectators)
            spectator.hear(message);
    }

    spectatorsHearQuote(quote) {
        for (let spectator of this.spectators)
            spectator.hearQuote(quote);
    }

    spectatorsSeeVote(vote) {
        for (let spectator of this.spectators)
            spectator.seeVote(vote);
    }

    spectatorsSeeUnvote(info) {
        for (let spectator of this.spectators)
            spectator.seeUnvote(info);
    }

    queueAction(action) {
        var delay = action.delay;

        if (this.processingActionQueue)
            delay++;

        while (this.actions.length <= delay)
            this.actions.push(new Queue());

        this.actions[delay].enqueue(action);
    }

    dequeueAction(action) {
        for (let i in this.actions) {
            if (this.processingActionQueue && i == 0)
                continue;

            this.actions[i].remove(action);
        }
    }

    processActionQueue() {
        for (let player of this.players)
            player.queueNonmeetActions();

        this.events.emit("actionsNext", this.actions[0]);
        this.processingActionQueue = true;

        for (let action of this.actions[0])
            action.do();

        this.events.emit("afterActions");
        this.actions.push(new Queue());

        for (let i = 1; i < this.actions.length; i++)
            this.actions[i - 1] = this.actions[i];

        this.actions.pop();
        this.processingActionQueue = false;
    }

    instantAction(action, meeting) {
        this.events.emit("instantAction", action);
        action.do();

        if (this.checkGameEnd())
            return;

        this.checkAllMeetingsReady();
        this.processDeathQueue();
        this.processRevealQueue();
        this.processAlertQueue();
    }

    // A test branch version of this.makeMeetings()
    // will refactor into makeMeetings when stable
    instantMeeting(meetings, players) {
        for (let player of players) {
            player.joinMeetings(meetings)
        }

        for (let meetingName in meetings) {
            let toMeet = this.getMeetingByName(meetingName);
            toMeet.init();
        }
        
        this.sendMeetings(players);
    }

    isMustAct() {
        return this.mustAct || this.setup.mustAct;
    }

    isNoAct() {
        return false;
    }

    checkGameEnd() {
        var [finished, winners] = this.checkWinConditions();

        if (finished)
            this.endGame(winners);

        return finished;
    }

    checkWinConditions() {
        return [false];
    }

    getGameTypeOptions() {
        return {};
    }

    immediateEnd() {
        this.endNow = true;

        // Clear current timers
        this.clearTimers();

        // Finish all meetings and take actions
        this.finishMeetings();

        // Take snapshot of roles
        this.history.recordAllRoles();

        // Take snapshot of dead players
        this.history.recordAllDead();

        var winners = new Winners(this);
        winners.addGroup("No one");
        this.endGame(winners);
    }

    async endGame(winners) {
        try {
            if (this.finished)
                return;

            this.finished = true;
            this.clearTimers();

            this.winners = winners;
            this.currentState = -2;

            var stateInfo = this.getStateInfo();
            this.broadcastState(stateInfo);
            this.addStateToHistories(stateInfo.name);

            this.events.emit("aboutToFinish");

            this.history.recordAllRoles();
            this.history.recordAllDead();

            winners.queueAlerts();
            this.processDeathQueue();
            this.processRevealQueue();
            this.processAlertQueue();

            for (let player of this.players) {
                this.broadcast("reveal", { playerId: player.id, role: `${player.role.name}:${player.role.modifier}` });
                player.removeAllEffects();
            }

            this.broadcast("winners", winners.getWinnersInfo());

            if (this.isTest) {
                this.broadcast("finished");
                await redis.deleteGame(this.id);
                return;
            }

            // Start postgame meeting
            this.postgame = this.createMeeting(PostgameMeeting);

            for (let player of this.players)
                if (!player.left)
                    this.postgame.join(player);

            this.postgame.init();

            for (let player of this.players)
                if (!player.left)
                    player.sendMeeting(this.postgame);

            this.createTimer("postgame", this.postgameLength, () => this.endPostgame());
        }
        catch (e) {
            logger.error(e);
        }
    }

    async endPostgame() {
        try {
            if (this.postgameOver)
                return;

            this.postgameOver = true;
            this.clearTimers();
            this.broadcast("finished");
            await redis.deleteGame(this.id);

            for (let player of this.players)
                if (!player.left)
                    player.user.disconnect();

            var setup = await models.Setup.findOne({ id: this.setup.id })
                .select("id alignmentPlays alignmentWins");

            var history = this.history.getHistoryInfo(null, true);
            var users = [];
            var playersGone = Object.values(this.playersGone);
            var players = this.players.concat(playersGone);

            for (let player of players) {
                let userId = player.userId || player.user.id;
                let user = await models.User.findOne({ id: userId })
                    .select("_id");

                if (user)
                    users.push(user._id);
            }

            var playerNames = players.map(p => p.name);
            players = players.map(p => p.id);

            var game = new models.Game({
                id: this.id,
                type: this.type,
                lobby: this.lobby,
                setup: setup._id,
                users: users,
                players: players,
                left: playersGone.map(p => p.id),
                names: playerNames,
                winners: this.winners.players.map(p => p.id),
                history: JSON.stringify(history),
                startTime: this.startTime,
                endTime: Date.now(),
                ranked: this.ranked,
                private: this.private,
                guests: this.guests,
                spectating: this.spectating,
                voiceChat: this.voiceChat,
                readyCheck: this.readyCheck,
                stateLengths: this.stateLengths,
                gameTypeOptions: JSON.stringify(this.getGameTypeOptions())
            });
            await game.save();

            var rolePlays = setup.rolePlays || {};
            var roleWins = setup.roleWins || {};

            for (let playerId in this.originalRoles) {
                let roleName = this.originalRoles[playerId].split(":")[0];

                if (rolePlays[roleName] == null)
                    rolePlays[roleName] = 0;

                rolePlays[roleName]++;
            }

            for (let playerId of this.winners.getPlayers()) {
                let roleName = this.originalRoles[playerId].split(":")[0];

                if (roleWins[roleName] == null)
                    roleWins[roleName] = 0;

                roleWins[roleName]++;
            }

            await models.Setup.updateOne(
                { id: setup.id },
                {
                    $inc: { played: 1 },
                    $set: { rolePlays, roleWins }
                }
            ).exec();

            for (let player of this.players) {
                let rankedPoints = 0;

                if (player.won) {
                    let roleName = this.originalRoles[player.id].split(":")[0];

                    if (rolePlays[roleName] > constants.minRolePlaysForPoints) {
                        let wins = roleWins[roleName];
                        let plays = rolePlays[roleName];
                        let perc = wins / plays;
                        rankedPoints = Math.round((1 - perc) * 100);
                    }
                }

                await models.User.updateOne(
                    { id: player.user.id },
                    {
                        $push: { games: game._id },
                        $set: { stats: player.user.stats, playedGame: true },
                        $inc: {
                            rankedPoints: rankedPoints,
                            coins: this.ranked && player.won ? 1 : 0,
                        }
                    }
                ).exec();

                // if (this.ranked && player.user.referrer && player.user.rankedCount == constants.referralGames - 1) {
                //     await models.User.updateOne(
                //         { id: player.user.referrer },
                //         { $inc: { coins: constants.referralCoins } }
                //     );
                // }
            }

            delete games[this.id];
            deprecationCheck();
        }
        catch (e) {
            logger.error(e);
        }
    }

    async queueScheduleNotifications() {
        var usersWhoReserved = await redis.getGameReservations(this.id);

        this.timeouts.push(setTimeout(() => {
            routeUtils.createNotification({
                content: `Game ${this.id} is starting! Click to join.`,
                icon: "gamepad",
                link: `/game/${this.id}`
            }, usersWhoReserved);
        }, this.scheduled - Date.now()));

        var oneHourBefore = this.scheduled - Date.now() - (1000 * 60 * 60);

        if (oneHourBefore < 1000)
            return;

        this.timeouts.push(setTimeout(() => {
            routeUtils.createNotification({
                content: `Game ${this.id} is scheduled to start in one hour.`,
                icon: "gamepad"
            }, usersWhoReserved);
        }, this.scheduled - Date.now()));
    }
}
