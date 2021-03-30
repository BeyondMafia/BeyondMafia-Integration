const express = require("express");
const passport = require("../passportOptions");
const router = express.Router();

router.get("/discord", passport.authenticate("discord"));
router.get("/discord/redirect", passport.authenticate("discord", {
    successRedirect: process.env.OAUTH_SUCCESS_REDIR,
    failureRedirect: process.env.OAUTH_FAIL_REDIR
}));

router.get("/twitch", passport.authenticate("twitch"));
router.get("/twitch/redirect", passport.authenticate("twitch", {
    successRedirect: process.env.OAUTH_SUCCESS_REDIR,
    failureRedirect: process.env.OAUTH_FAIL_REDIR
}));

router.get("/google", passport.authenticate("google"));
router.get("/google/redirect", passport.authenticate("google", {
    successRedirect: process.env.OAUTH_SUCCESS_REDIR,
    failureRedirect: process.env.OAUTH_FAIL_REDIR
}));

router.get("/steam", passport.authenticate("steam"));
router.get("/steam/redirect", passport.authenticate("steam", {
    successRedirect: process.env.OAUTH_SUCCESS_REDIR,
    failureRedirect: process.env.OAUTH_FAIL_REDIR
}));


module.exports = router;
