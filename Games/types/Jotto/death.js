module.exports = function (type, name) {
    const templates = {
        "basic": `${name} couldn't think of a word.`,
        "leave": `${name} dropped their pencil and left.`,
        "veg": `${name} turned into stone, unable to think of a word.`,
    };

    return templates[type];
};
