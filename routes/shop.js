const express = require("express");
const routeUtils = require("./utils");
const redis = require("../modules/redis");
const models = require("../db/models");
const logger = require("../modules/logging")(".");
const router = express.Router();

const shopItems = [
    {
        name: "Name and Text Colors",
        desc: "Set the colors of your name and text in games and chat",
        key: "textColors",
        price: 20,
        limit: 1,
        onBuy: function () {

        }
    },
    {
        name: "Profile Customization",
        desc: "Change the panel color and banner image on your profile",
        key: "customProfile",
        price: 20,
        limit: 1,
        onBuy: function () {

        }
    },
    {
        name: "Name Change",
        desc: "Change your name once per purchase",
        key: "nameChange",
        price: 20,
        limit: null,
        onBuy: function () {

        }
    },
    {
        name: "Birthday Change",
        desc: "Change your birthday once per purchase",
        key: "bdayChange",
        price: 10,
        limit: null,
        onBuy: function () {
            
        }
    },
    {
        name: "3 Character Username",
        desc: "Set your name to one that is 3 characters long",
        key: "threeCharName",
        price: 100,
        limit: 1,
        onBuy: function () {

        }
    },
    {
        name: "2 Character Username",
        desc: "Set your name to one that is 2 characters long",
        key: "twoCharName",
        price: 400,
        limit: 1,
        onBuy: function () {

        }
    },
    {
        name: "1 Character Username",
        desc: "Set your name to one that is 1 character long",
        key: "oneCharName",
        price: 800,
        limit: 1,
        onBuy: function () {

        }
    },
];

router.get("/info", async function (req, res) {
    res.setHeader("Content-Type", "application/json");
    try {
        var userId = await routeUtils.verifyLoggedIn(req);
        var user = await models.User.findOne({ id: userId })

        res.send({ shopItems, balance: user.coins });
    }
    catch (e) {
        logger.error(e);
        res.status(500);
        res.send("Error loading shop data.");
    }
});

router.post("/spendCoins", async function (req, res) {
    try {
        var userId = await routeUtils.verifyLoggedIn(req);
        var itemIndex = Number(req.body.item);
        var item = shopItems[itemIndex];

        var user = await models.User.findOne({ id: userId })
            .select("coins itemsOwned");

        if (user.coins < item.price) {
            res.status(500);
            res.send("You do not have enough coins to purchase this.")
            return;
        }

        if (item.limit != null && user.itemsOwned[item.key] >= item.limit) {
            res.status(500);
            res.send("You already own this.")
            return;
        }

        await models.User.updateOne(
            { id: userId },
            {
                $inc: {
                    [`itemsOwned.${item.key}`]: 1,
                    coins: -1 * item.price
                }
            }
        ).exec();

        await redis.cacheUserInfo(userId, true);
        res.sendStatus(200);
    }
    catch (e) {
        logger.error(e);
        res.status(500);
        res.send("Error spending coins.");
    }
});

module.exports = router;