import React, { useEffect, useState } from "react";

import { Avatar } from "../pages/User/User"
import { emotify } from "./Emotes";
import badWords from "../json/badWords";
import slurs from "../json/slurs";

export function ItemList(props) {
	const items = props.items;
	const itemRows = items.map(props.map);

	return (
		<div
			className={`item-list ${props.className || ""}`}>
			{itemRows}
		</div>
	);
}

export function PanelGrid(props) {
	const panels = props.panels.map((panel, i) => (
		<div className="box-panel" key={i}>
			<div className="heading">
				{panel.icon}
				<div className="heading-text">
					{panel.name}
				</div>
			</div>
			<div className="content">
				{panel.text}
			</div>
		</div>
	));
	return (
		<div className="panel-grid">
			{panels}
		</div>
	);
}

export function Time(props) {
	var unit = "millisecond";
	var value = props.millisec;
	var suffix = props.suffix || "";
	var minSec = props.minSec;

	const units = [
		{
			name: "second",
			scale: 1000
		},
		{
			name: "minute",
			scale: 60
		},
		{
			name: "hour",
			scale: 60
		},
		{
			name: "day",
			scale: 24
		},
		{
			name: "week",
			scale: 7
		},
		{
			name: "year",
			scale: 52
		}
	];

	let i = 0;
	while (i < units.length - 1 && value >= units[i].scale) {
		value /= units[i].scale;
		unit = units[i].name;
		i++;
	}

	if (minSec && unit == "millisecond")
		return `Less than a second${suffix}`;

	value = Math.floor(value);

	if (value > 1)
		unit += "s";

	return `${value} ${unit}${suffix}`;
}

export function NotificationHolder(props) {
	const notifCount = props.notifCount;
	const onClick = props.onClick;
	const lOffset = props.lOffset;

	return (
		<div
			className={`notif-bound ${props.className || ""}`}
			onClick={onClick}
			ref={props.fwdRef}>
			{notifCount > 0 &&
				<>
					<i className={`fas fa-circle notif-icon ${lOffset ? "l-offset" : ""}`}>
						<div className="notif-count">
							{notifCount}
						</div>
					</i>
				</>
			}
			{props.children}
		</div>
	);
}

export function UserText(props) {
	const [content, setContent] = useState(props.text);

	useEffect(() => {
		if (props.text == null)
			return;

		let text = props.text;

		if (props.filterProfanity)
			text = filterProfanity(text, props.settings, props.profChar);

		if (props.linkify)
			text = linkify(text);

		if (props.avify)
			text = avify(text, props.players);

		if (props.emotify)
			text = emotify(text);

		setContent(text);
	}, [props.text]);

	return content;
}

export function linkify(text) {
	if (text == null)
		return;

	if (!Array.isArray(text))
		text = [text];

	const linkRegex = /http(s{0,1}):\/\/([\w.]+)\.(\w+)([^\s]*)/g;

	for (let i in text) {
		let _segment = text[i];
		let segment = [];
		let lastIndex = 0;
		let regexRes = linkRegex.exec(_segment);

		while (regexRes) {
			segment.push(_segment.slice(lastIndex, regexRes.index));
			segment.push(<a href={regexRes[0]} target="blank" key={lastIndex}>{regexRes[0]}</a>);

			lastIndex = linkRegex.lastIndex;
			regexRes = linkRegex.exec(_segment);
		}

		segment.push(_segment.slice(lastIndex, _segment.length));
		text[i] = segment;
	}

	text = text.flat();
	return text.length == 1 ? text[0] : text;
}

export function avify(text, players) {
	// Creating RegExp to match %User calls.
	const playerNames = Object.values(players).map(player => player.name);
	const playerNamesRegex = new RegExp(`^%(${playerNames.join("|")})$`);

	// Checking text against %User calls.
	const words = text.split(" ");
	for (const i in words) {
		if (playerNamesRegex.test(words[i])) {
			const user = Object.values(players).find(player => player.name === words[i].substring(1));
			words[i] = <Avatar
				name={user.name}
				id={user.userId}
				hasImage={user.avatar}
				small={true}
				/>;
		}
	}
	text = words.flat();
	return text;
}

export function filterProfanity(text, settings, char) {
	if (text == null)
		return;

	if (!Array.isArray(text))
		text = [text];

	settings = settings || {};

	for (let i in text) {
		let segment = text[i];

		if (typeof segment != "string")
			continue;

		char = char || "*";

		if (!settings.disablePg13Censor)
			segment = filterProfanitySegment(badWords, segment, char);

		if (!settings.disableAllCensors)
			segment = filterProfanitySegment(slurs, segment, char);

		text[i] = segment;
	}

	text = text.flat();
	return text.length == 1 ? text[0] : text;
}

function filterProfanitySegment(profanity, segment, char) {
	for (let word of profanity) {
		let regex = new RegExp(word, "i");
		let regexRes = regex.exec(segment);

		while (regexRes) {
			let index = regexRes.index;
			let length = regexRes[0].length;
			let replacement = char.repeat(length);

			segment = segment.split("");
			segment.splice(index, length, replacement);
			segment = segment.join("");
			regexRes = regex.exec(segment);
		}
	}

	return segment;
}

export function useOnOutsideClick(refs, action) {
	if (!Array.isArray(refs))
		refs = [refs];

	function onOutsideClick(e) {
		for (let ref of refs)
			if (!ref || !ref.current || ref.current.contains(e.target))
				return;

		action();
	}

	useEffect(() => {
		document.addEventListener("click", onOutsideClick);
		document.addEventListener("contextmenu", onOutsideClick);

		return () => {
			document.removeEventListener("click", onOutsideClick);
		};
	}, refs);
}