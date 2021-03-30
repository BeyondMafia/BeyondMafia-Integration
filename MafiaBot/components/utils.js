const commando = require("discord.js-commando");
const global = require("./global");
const models = require("../../db/models");

function random (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function randArrVal (arr, splice) {
    var index = this.random(0, arr.length - 1);
    var res = arr[index];

    if (splice)
        arr.splice(index, 1);

    return res;
}

function randomizeArray (arr) {
    let newArr = [];

    while (arr.length)
        newArr.push(this.randArrVal(arr, true));

    return newArr;
}

function isHomeGuild (guild) {
    return guild.equals(global.homeGuild);
}

function hasRole (user, role) {
    return user.roles.cache.find(r => r.equals(role)) ? true : false;
}

function fromChannel (message, channel) {
    return message.channel.equals(channel);
}

module.exports = {
    random,
    randArrVal,
    randomizeArray,
    isHomeGuild,
    hasRole,
    fromChannel
};