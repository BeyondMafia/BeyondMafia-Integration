module.exports = function (type, name) {
    const templates = {
        "basic": `${name} was killed.`,
        "lynch": `${name} was executed by the village.`,
        "leave": `${name} left the game.`,
        "veg": `${name} turned into a vegetable.`,
        "gun": `${name} collapses to the ground from a gunshot wound.`,
        "burn": `${name} suddenly lights on fire and burns to a crisp!`,
        "poison": `${name} finally succumbs to poison.`,
        "lynchRevenge": `${name} was killed in an act of revenge.`,
        "bomb": `${name} explodes into a thousand pieces.`,
        "curse": `${name} feels a cold chill run down their spine!`
    };

    return templates[type];
};
