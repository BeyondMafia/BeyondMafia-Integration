module.exports = function (type, name) {
    const templates = {
        "basic": `${name} was killed.`,
        "lynch": `${name} was executed by the village.`,
        "leave": `${name} left the game.`,
        "veg": `${name} turned into a vegetable.`,
        "gun": `${name} collapses to the ground from a gunshot wound.`,
        "poison": `${name} finally succumbs to poison.`,
        "lynchRevenge": `${name} was killed in an act of revenge.`,
        "bomb": `${name} explodes into a thousand pieces.`,
    };

    return templates[type];
};
