import React, { useEffect } from "react";

import "../css/emotes.css";

export function Emote(props) {
	const emoteKey = props.emote.toLowerCase();
	const emote = Emotes[emoteKey];

	return (
		<div
			className="emote"
			title={emote.name}
			style={{ backgroundImage: `url('/images/emotes/${emoteKey}.${emote.type}')` }} />
	);
}

export function emotify(text) {
	if (text == null)
		return;

	if (!Array.isArray(text))
		text = [text];


	for (let i in text) {
		let segment = text[i];

		if (typeof segment != "string")
			continue;

		const words = segment.split(" ");

		for (let j in words) {
			let word = words[j];

			for (let k in EmoteKeys) {
				let key = EmoteKeys[k];
				let regex = new RegExp(`^${key}$`, "i");

				if (word.match(regex)) {
					words[j] = <Emote emote={key} />;
					break;
				}
				else if (k == EmoteKeys.length - 1)
					words[j] = words[j] + " ";
			}
		}

		text[i] = words;
	}

	text = text.flat();
	return text.length == 1 ? text[0] : text;
}

export const Emotes = {
	"ez": {
		name: "EZ",
		type: "png"
	},
	"doge": {
		name: "doge",
		type: "png"
	},
	"feelsdankman": {
		name: "FeelsDankMan",
		type: "png"
	},
	"feelsokayman": {
		name: "FeelsOkayMan",
		type: "png"
	},
	"kapp": {
		name: "Kapp",
		type: "png"
	},
	"monkagun": {
		name: "MonkaGun",
		type: "png"
	},
	"monkahmm": {
		name: "MonkaHmm",
		type: "png"
	},
	"monkas": {
		name: "MonkaS",
		type: "png"
	},
	"nodders": {
		name: "Nodders",
		type: "gif"
	},
	"nopers": {
		name: "Nopers",
		type: "gif"
	},
	"omegalul": {
		name: "Omegalul",
		type: "png"
	},
	"peepohappy": {
		name: "PeepoHappy",
		type: "png"
	},
	"peeposad": {
		name: "PeepoSad",
		type: "png"
	},
	"peepowtf": {
		name: "PeepoWtf",
		type: "png"
	},
	"pepega": {
		name: "Pepega",
		type: "png"
	},
	"pepegaaim": {
		name: "PepegaAim",
		type: "gif"
	},
	"pepehands": {
		name: "PepeHands",
		type: "png"
	},
	"pepelaugh": {
		name: "PepeLaugh",
		type: "png"
	},
	"pepemeltdown": {
		name: "PepeMeltdown",
		type: "gif"
	},
	"pepepains": {
		name: "PepePains",
		type: "png"
	},
	"pepog": {
		name: "PepoG",
		type: "png"
	},
	"sadge": {
		name: "Sadge",
		type: "png"
	},
	"pepepls": {
		name: "PepePls",
		type: "gif"
	},
};

export const EmoteKeys = Object.keys(Emotes);