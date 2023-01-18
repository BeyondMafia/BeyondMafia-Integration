const chai = require("chai"),
    should = chai.should();
const db = require("../db/db");
const redis = require("../modules/redis");

describe("Redis", function () {
    describe("Token authentication", function () {
        it("should generate a sha1 token and authenticate it", async function () {
            await db.promise;
            await redis.client.flushdbAsync();

            var token = await redis.createAuthToken("test");
            token.should.have.lengthOf(40);

            var userId = await redis.authenticateToken(token);
            should.exist(userId);
            userId.should.equal("test");
        });
    });

    describe("Creating game", function () {
        it("should allow users to be creating one and only one game", async function () {
            await db.promise;
            await redis.client.flushdbAsync();

            var userId = "test";

            var creating = await redis.getCreatingGame(userId);
            creating.should.be.false;

            creating = await redis.getSetCreatingGame(userId);
            creating.should.be.false;

            creating = await redis.getSetCreatingGame(userId);
            creating.should.be.true;

            await redis.unsetCreatingGame(userId);
            creating = await redis.getCreatingGame(userId);
            creating.should.be.true;

            await redis.unsetCreatingGame(userId);
            creating = await redis.getCreatingGame(userId);
            creating.should.be.false;
        });
    });

    describe("Game info", function () {
        it("should store game info and retrieve it", async function () {
            await db.promise;
            await redis.client.flushdbAsync();

            var gameId = "test";

            await redis.createGame(gameId, {
                status: "Open",
                settings: {
                    setup: "testSetup",
                    private: true,
                    spectating: true,
                    stateLengths: {
                        "Day": 1000,
                        "Night": 1000
                    }
                },
                createTime: Date.now()
            });

            var info = await redis.getGameInfo(gameId);
            info.status.should.equal("Open");
            info.settings.setup.should.equal("testSetup");
            info.settings.private.should.be.true;
            info.settings.spectating.should.be.true;
            info.players.should.have.lengthOf(0);

            await redis.setGameStatus(gameId, "inProgress");
            info = await redis.getGameInfo(gameId);
            info.status.should.equal("inProgress");

            info = await redis.getGameInfo("random");
            should.not.exist(info);
        });
    });

    describe("Game filters", function () {
        it("should retrieve games by status or privacy", async function () {
            await db.promise;
            await redis.client.flushdbAsync();

            await redis.createGame("test1", {
                type: "Mafia",
                status: "Open",
                settings: {
                    setup: "testSetup",
                    private: true,
                    spectating: true,
                    stateLengths: {
                        "Day": 1000,
                        "Night": 1000
                    }
                },
                createTime: Date.now()
            });

            await redis.createGame("test2", {
                type: "Mafia",
                status: "In Progress",
                settings: {
                    setup: "testSetup",
                    private: false,
                    spectating: false,
                    stateLengths: {
                        "Day": 1000,
                        "Night": 1000
                    }
                },
                createTime: Date.now()
            });

            await redis.createGame("test3", {
                type: "Mafia",
                status: "In Progress",
                settings: {
                    setup: "testSetup",
                    private: true,
                    spectating: false,
                    stateLengths: {
                        "Day": 1000,
                        "Night": 1000
                    }
                },
                createTime: Date.now()
            });

            await redis.createGame("test4", {
                type: "2r1b",
                status: "Open",
                settings: {
                    setup: "testSetup",
                    private: false,
                    spectating: true,
                    stateLengths: {
                        "Day": 1000,
                        "Night": 1000
                    }
                },
                createTime: Date.now()
            });

            var games = await redis.getAllGames();
            games.should.have.lengthOf(4);

            games = await redis.getAllGames("Mafia");
            games.should.have.lengthOf(3);

            games = await redis.getAllGames("2r1b");
            games.should.have.lengthOf(1);

            games = await redis.getOpenGames();
            games.should.have.lengthOf(2);

            games = await redis.getOpenGames("2r1b");
            games.should.have.lengthOf(1);

            games = await redis.getOpenPublicGames();
            games.should.have.lengthOf(1);

            games = await redis.getOpenPublicGames("Mafia");
            games.should.have.lengthOf(0);

            games = await redis.getInProgressGames();
            games.should.have.lengthOf(2);

            games = await redis.getInProgressGames("Mafia");
            games.should.have.lengthOf(2);

        });
    });

    describe("Game joining", function () {
        it("should store and retrieve the players of a game", async function () {
            await db.promise;
            await redis.client.flushdbAsync();

            var userId = "testUser";
            var gameId = "testGame";

            await redis.createGame(gameId, {
                type: "Mafia",
                status: "Open",
                settings: {
                    setup: "testSetup",
                    private: false,
                    spectating: true,
                    stateLengths: {
                        "Day": 1000,
                        "Night": 1000
                    }
                },
                createTime: Date.now()
            });

            await redis.joinGame(userId, gameId);
            var inGame = await redis.inGame(userId);
            inGame.should.equal(gameId);

            inGame = await redis.inGame("testUser2");
            inGame.should.be.false;

            var info = await redis.getGameInfo(gameId);
            should.exist(info);
            should.exist(info.players);

            await redis.leaveGame(userId);
            inGame = await redis.inGame(userId);

            info = await redis.getGameInfo(gameId);
            should.exist(info);
            should.exist(info.players);
            info.players.should.have.lengthOf(0);
        });
    });

    describe("Game deletion", function () {
        it("should delete games and remove players from those games", async function () {
            await db.promise;
            await redis.client.flushdbAsync();

            var userId = "testUser";
            var gameId = "testGame";

            await redis.createGame(gameId, {
                type: "Mafia",
                status: "Open",
                setup: "testSetup",
                private: false,
                spectating: true,
                settings: {}
            });

            await redis.joinGame(userId, gameId);
            var inGame = await redis.inGame(userId);
            inGame.should.equal(gameId);

            await redis.deleteGame(gameId);
            var gameExists = await redis.gameExists(gameId);
            var info = await redis.getGameInfo(gameId);
            gameExists.should.be.false;
            should.not.exist(info);
        });
    });
});