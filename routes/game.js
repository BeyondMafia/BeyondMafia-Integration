const express = require("express");
const constants = require("../constants");
const models = require("../db/models");
const routeUtils = require("./utils");
const redis = require("../redis");
const gameLoadBalancer = require("../gameLoadBalancer");
const logger = require("../logging")(".");
const router = express.Router();

router.post("/leave", async function (req, res) {
    try {
        var userId;

        if (req.body.key == process.env.BOT_KEY)
            userId = req.body.userId;
        else
            userId = await routeUtils.verifyLoggedIn(req);

        await gameLoadBalancer.leaveGame(userId);
        res.sendStatus(200);
    }
    catch (e) {
        logger.error(e);
        res.status(500);
        res.send("Error leaving game");
    }
});

router.get("/list", async function (req, res) {
    res.setHeader("Content-Type", "application/json");
    try {
        const userId = await routeUtils.verifyLoggedIn(req, true);
        const pageSize = 7;
        const pageLimit = 20;
        const start = ((Number(req.query.page) || 1) - 1) * pageSize;
        const gameLimit = pageSize * pageLimit;
        const listName = String(req.query.list);
        const lobby = String(req.query.lobby || "Main");

        if (!routeUtils.validProp(lobby) || constants.lobbies.indexOf(lobby) == -1) {
            logger.error("Invalid lobby.");
            res.send({ games: [], pages: 1 });
            return;
        }

        if (listName != "finished") {
            const end = start + pageSize;
            var games = [];

            if (listName == "open") {
                games = await redis.getOpenPublicGames();
                games.sort((a, b) => {
                    return routeUtils.scoreGame(b) - routeUtils.scoreGame(a);
                });
            }
            else {
                games = await redis.getInProgressPublicGames();
                games.sort((a, b) => b.startTime - a.startTime);
            }

            games = games.filter(game => game.lobby == lobby).slice(start, end);
            var newGames = [];

            for (let game of games) {
                let newGame = {};

                newGame.id = game.id;
                newGame.type = game.type;
                newGame.setup = await models.Setup.findOne({ id: game.settings.setup })
                    .select("id gameType name roles closed count total -_id");
                newGame.setup = newGame.setup.toJSON();
                newGame.hostId = game.hostId;
                newGame.players = game.players.length;
                newGame.ranked = game.settings.ranked;
                newGame.spectating = game.settings.spectating;
                newGame.voiceChat = game.settings.voiceChat
                newGame.scheduled = game.settings.scheduled

                if (userId) {
                    var reservations = await redis.getGameReservations(game.id);
                    newGame.reserved = reservations.indexOf(userId) != -1;
                }

                newGames.push(newGame);
            }

            res.send({ games: newGames, pages: Math.ceil(newGames.length / pageSize) || 1 })
        }
        else if (start < gameLimit) {
            const games = await models.Game.find({ lobby })
                .select("id type setup ranked private spectating voiceChat stateLengths gameTypeOptions broken -_id")
                .populate("setup", "id gameType name roles closed count total -_id")
                .sort("-endTime")
                .skip(start)
                .limit(pageSize);
            const count = await models.Game.estimatedDocumentCount();
            res.send({ games: games, pages: Math.min(Math.ceil(count / pageSize), pageLimit) || 1 });
        }
        else
            res.send({ games: [], pages: pageLimit });
    }
    catch (e) {
        logger.error(e);
        res.send({ games: [], pages: 1 });
    }
});

router.get("/:id/connect", async function (req, res) {
    res.setHeader("Content-Type", "application/json");
    try {
        const gameId = String(req.params.id);
        const userId = await routeUtils.verifyLoggedIn(req, true);
        const game = await redis.getGameInfo(gameId, true);

        if (!game) {
            res.status(500);
            res.send("Game not found.");
            return;
        }

        if (!userId && !game.settings.guests) {
            res.status(500);
            res.send("You must be logged in to join or spectate games.");
            return;
        }

        if (userId && !(await routeUtils.verifyPermission(userId, "playGame"))) {
            res.status(500);
            res.send("You are unable to play games.");
            return;
        }

        const type = game.type;
        const port = game.port;
        const token = userId && await redis.createAuthToken(userId);

        if (type && !isNaN(port))
            res.send({ port, type, token });
        else {
            res.status(500);
            res.send("Error loading game.");
        }
    }
    catch (e) {
        logger.error(e);
        res.status(500);
        res.send("Error loading game.");
    }
});

router.get("/:id/review/data", async function (req, res) {
    res.setHeader("Content-Type", "application/json");
    try {
        var gameId = String(req.params.id);
        let game = await models.Game.findOne({ id: gameId })
            .select("-_id")
            .populate("setup", "-_id")
            .populate("users", "id avatar tag settings emojis -_id");

        if (game && !game.private) {
            game = game.toJSON();
            game.users = game.users.map(user => ({
                ...user,
                settings: {
                    textColor: user.settings.textColor,
                    nameColor: user.settings.textColor
                }
            }));
            res.send(game);
        }
        else {
            res.status(500);
            res.send("Game not found");
        }
    }
    catch (e) {
        logger.error(e);
        res.status(500);
        res.send("Error loading game info");
    }
});

router.get("/:id/info", async function (req, res) {
    res.setHeader("Content-Type", "application/json");
    try {
        var gameId = String(req.params.id);
        var game = await redis.getGameInfo(gameId);

        if (!game) {
            game = await models.Game.findOne({ id: gameId })
                .select("type users players left stateLengths ranked spectating voiceChat startTime endTime gameTypeOptions -_id")
                .populate("users", "id name avatar -_id");

            if (!game) {
                res.status(500);
                res.send("Game not found");
                return;
            }

            game = game.toJSON();
            game.totalPlayers = game.players.length - game.left.length;
            game.players = game.users.slice(0, game.players.length - game.left.length);
            game.settings = {
                ranked: game.ranked,
                spectating: game.spectating,
                guests: game.guests,
                voiceChat: game.voiceChat,
                stateLengths: game.stateLengths,
                gameTypeOptions: JSON.parse(game.gameTypeOptions)
            };

            delete game.users;
            delete game.ranked;
            delete game.spectating;
            delete game.stateLengths;
            delete game.gameTypeOptions;
        }
        else {
            delete game.port;
            delete game.status;
        }

        res.send(game);
    }
    catch (e) {
        logger.error(e);
        res.status(500);
        res.send("Error loading game info");
    }
});

router.post("/host", async function (req, res) {
    try {
        var userId;

        if (req.body.key == process.env.BOT_KEY)
            userId = req.body.userId;
        else
            userId = await routeUtils.verifyLoggedIn(req);

        if (!(await routeUtils.verifyPermission(userId, "playGame"))) {
            res.status(500);
            res.send("You are unable to play games.");
            return;
        }

        const gameType = String(req.body.gameType);
        const lobby = String(req.body.lobby);
        const rehostId = req.body.rehost && String(req.body.rehost);
        const scheduled = Number(req.body.scheduled);

        if (!routeUtils.validProp(gameType) || constants.gameTypes.indexOf(gameType) == -1) {
            res.status(500);
            res.send("Invalid game type.");
            return;
        }

        if (!routeUtils.validProp(lobby) || constants.lobbies.indexOf(lobby) == -1) {
            res.status(500);
            res.send("Invalid lobby.");
            return;
        }

        if (rehostId) {
            var openGames = await redis.getOpenGames(gameType);

            for (let game of openGames) {
                if (game.settings.rehostId == rehostId) {
                    res.send(game.id);
                    return;
                }
            }
        }

        const configuredStateLengths = Object(req.body.stateLengths);
        var stateLengths = {};

        for (let stateName in constants.configurableStates[gameType]) {
            let min = constants.configurableStates[gameType][stateName].min;
            let max = constants.configurableStates[gameType][stateName].max;
            let stateLength = Number(configuredStateLengths[stateName]) * 60 * 1000;

            if (isNaN(stateLength) || stateLength < min || stateLength > max)
                stateLength = constants.configurableStates[gameType][stateName].default;

            stateLengths[stateName] = stateLength;
        }

        if (!req.body.setup) {
            res.status(500);
            res.send("Please select a setup");
            return;
        }

        var setup = await models.Setup.findOne({ id: String(req.body.setup) })
            .select("-_id -__v -creator -hash");

        if (!setup) {
            res.status(500);
            res.send("Setup not found");
            return;
        }

        if (setup.gameType != gameType) {
            res.status(500);
            res.send("Invalid setup for this game");
            return;
        }

        if (req.body.ranked && setup.total < 7) {
            res.status(500);
            res.send("Ranked games must have at least 7 players.");
            return;
        }

        if (req.body.ranked && req.body.private) {
            res.status(500);
            res.send("Ranked games cannot be private.");
            return;
        }

        if (req.body.ranked && req.body.guests) {
            res.status(500);
            res.send("Ranked games cannot contain guests.");
            return;
        }

        if (req.body.ranked && req.body.spectating) {
            res.status(500);
            res.send("Ranked games cannot be spectated.");
            return;
        }

        if (req.body.ranked && req.body.voiceChat) {
            res.status(500);
            res.send("Ranked games cannot use voice chat.");
            return;
        }

        if (req.body.voiceChat && req.body.spectating) {
            res.status(500);
            res.send("Voice chat games cannot be spectated.");
            return;
        }

        if (req.body.ranked && !(await routeUtils.verifyPermission(userId, "hostRanked"))) {
            res.status(500);
            res.send("You are unable to host ranked games.");
            return;
        }

        const settings = settingsChecks[gameType](req.body, setup);

        if (typeof settings == "string") {
            res.status(500);
            res.send(settings);
            return;
        }

        setup = setup.toJSON();
        setup.roles = JSON.parse(setup.roles);

        if (await redis.getSetCreatingGame(userId)) {
            res.status(500);
            res.send("Already creating a game.");
            redis.unsetCreatingGame(userId);
            return;
        }

        if (!scheduled && await redis.inGame(userId)) {
            res.status(500);
            res.send("You must leave your current game before creating a new one.");
            redis.unsetCreatingGame(userId);
            return;
        }

        if (scheduled && await redis.hostingScheduled(userId)) {
            res.status(500);
            res.send("You already have a game scheduled.");
            redis.unsetCreatingGame(userId);
            return;
        }

        if (scheduled && scheduled < Date.now() + (5 * 60 * 1000)) {
            res.status(500);
            res.send("Games must be scheduled at least 5 minutes in advance.");
            redis.unsetCreatingGame(userId);
            return;
        }

        if (scheduled && scheduled > Date.now() + (4 * 7 * 24 * 60 * 60 * 1000)) {
            res.status(500);
            res.send("Games must be scheduled to start within 4 weeks.");
            redis.unsetCreatingGame(userId);
            return;
        }

        if (!(await routeUtils.rateLimit(userId, "hostGame", res))) {
            redis.unsetCreatingGame(userId);
            return;
        }

        try {
            const gameId = await gameLoadBalancer.createGame(userId, gameType, {
                setup: setup,
                lobby: lobby,
                private: Boolean(req.body.private),
                guests: Boolean(req.body.guests),
                ranked: Boolean(req.body.ranked),
                spectating: Boolean(req.body.spectating),
                voiceChat: Boolean(req.body.voiceChat),
                rehostId: rehostId,
                scheduled: scheduled,
                stateLengths: stateLengths,
                ...settings
            });

            res.send(gameId);
            redis.unsetCreatingGame(userId);
        }
        catch (e) {
            redis.unsetCreatingGame(userId);
            throw e;
        }
    }
    catch (e) {
        logger.error(e);
        res.status(500);
        res.send("Error hosting game.");
    }
});

router.post("/reserve", async function (req, res) {
    try {
        var userId = await routeUtils.verifyLoggedIn(req);
        var gameId = String(req.body.gameId);

        if (!(await routeUtils.verifyPermission(userId, "playGame"))) {
            res.status(500);
            res.send("You are unable to play games.");
            return;
        }

        var game = await redis.getGameInfo(gameId);

        if (!game) {
            res.status(500);
            res.send("Game not found.");
            return;
        }

        if (!game.settings.scheduled) {
            res.status(500);
            res.send("Game is not scheduled to start in the future.");
            return;
        }

        if (game.settings.scheduled <= Date.now()) {
            res.status(500);
            res.send("Reservations are closed, try joining if the game has not started yet.");
            return;
        }

        var reserved = await redis.reserveGame(userId, gameId);

        if (reserved)
            res.send("Spot reserved!");
        else
            res.send("Reservations are full. You have been added to the backup queue.");
    }
    catch (e) {
        logger.error(e);
        res.status(500);
        res.send("Error reserving seat in game.");
    }
});

router.post("/unreserve", async function (req, res) {
    try {
        var userId = await routeUtils.verifyLoggedIn(req);
        var gameId = String(req.body.gameId);

        var game = await redis.getGameInfo(gameId);

        if (!game) {
            res.status(500);
            res.send("Game not found.");
            return;
        }

        if (!game.settings.scheduled) {
            res.status(500);
            res.send("Game is not scheduled to start in the future.");
            return;
        }

        await redis.unreserveGame(userId, gameId);
        res.send("Game reservation cancelled.");
    }
    catch (e) {
        logger.error(e);
        res.status(500);
        res.send("Error unreserving seat in game.");
    }
});

router.post("/cancel", async function (req, res) {
    try {
        var userId = await routeUtils.verifyLoggedIn(req);
        var gameId = String(req.body.gameId);

        var game = await redis.getGameInfo(gameId);

        if (!game) {
            res.status(500);
            res.send("Game not found.");
            return;
        }

        if (userId != game.hostId) {
            res.status(500);
            res.send("You are not the host of this game.");
            return;
        }

        if (!game.settings.scheduled) {
            res.status(500);
            res.send("Game is not scheduled to start in the future.");
            return;
        }

        await gameLoadBalancer.cancelGame(userId, gameId);
        res.send("Scheduled game cancelled.");
    }
    catch (e) {
        logger.error(e);
        res.status(500);
        res.send("Error cancelling scheduled game.");
    }
});

const settingsChecks = {
    "Mafia": (settings, setup) => {
        return {};
    },
    "Split Decision": (settings, setup) => {
        return {};
    },
    "Resistance": (settings, setup) => {
        return {};
    },
    "One Night": (settings, setup) => {
        return {};
    },
};

module.exports = router;
