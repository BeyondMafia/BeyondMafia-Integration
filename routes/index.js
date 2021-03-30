const express = require("express");
const constants = require("../constants");
const logger = require("../logging")(".");
const router = express.Router();

router.get("/nextRestart", function (req, res) {
    try {
        if (constants.restart != null)
            res.send(String(constants.restart));
        else
            res.send("-1");
    }
    catch (e) {
        logger.error(e);
        res.send("-1");
    }
});

router.get("/braintree", function (req, res) {
    res.send("Hi Braintree, this is Elliot Nester.");
});

module.exports = router;
