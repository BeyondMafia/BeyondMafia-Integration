import slurs from "../json/slurs";
import swears from "../json/swears";

/* Creates an array of profanity RegExps. See https://regex101.com for a detailed breakdown.
 *
 * ([^A-Z]|\s) matches any non-alphabet character or whitespace character
 * This is inserted between each character of the slur to prevent masking white spaces or punctuation.
 * 
 * \b matches word boundaries
 * [^A-Z] matches any non-alphabet characters
 * (${word}) matches the modified word RegExp (see above comment)
 * s matches the character "s" literally
 * 
 * The -i flag makes the RegExp case insensitive.
 * 
*/
function createProfanityRegexps(words) {
    return words
        .map((word) => word.split("").join(String.raw`+([^A-Z]|\s)*`).concat("+"))
        .map((word) => new RegExp(String.raw`\b[^A-Z]*((${word})+s*)+[^A-Z]*\b`, "i"));
}

// Creating profanity RegExps.
const slurRegexps = createProfanityRegexps(slurs);
const swearRegexps = createProfanityRegexps(swears);

// Leet speak mappings.
const leetMappings = {
    "0": "o",
    "1": "i",
    "2": "z",
    "3": "e",
    "4": "a",
    "5": "s",
    "7": "t",
    "8": "b"
};

// Server-side slur detection.
function textIncludesSlurs(text) {
    for (const num in leetMappings) {
        text = text.replace(num, leetMappings[num]);
    }
    for (const slurRegex of slurRegexps) {
        if (slurRegex.test(text)) {
            return true;
        }
    }
    return false;
};

// Client-side speech filtering.
function filterProfanitySegment(profanityType, segment, char) {
    let profanityRegexps;
    // Getting profanity list.
    switch (profanityType) {
        case "slurs":
            profanityRegexps = slurRegexps; break;
        case "swears":
            profanityRegexps = swearRegexps; break;
        default:
            return segment;
    }
    // Substituting numbers with letters.
    for (const num in leetMappings) {
        segment = segment.replace(num, leetMappings[num]);
    }
    // Filtering profanity.
    for (const profanityRegex of profanityRegexps) {
        let regexRes = profanityRegex.exec(segment);
        while (regexRes) {
            // regexRes.index returns the index of the start of the match, not the capturing group.
            const index = regexRes.index + regexRes[0].indexOf(regexRes[1]);
            const length = regexRes[1].length;
            segment = segment.slice(0, index) + char.repeat(length) + segment.slice(index + length);
            regexRes = profanityRegex.exec(segment);
        }
    }
    return segment;
}

export { filterProfanitySegment, textIncludesSlurs };
