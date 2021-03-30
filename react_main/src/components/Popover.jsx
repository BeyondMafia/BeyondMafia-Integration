import React, { useState, useContext, useRef, useEffect, useLayoutEffect } from "react";
import axios from "axios";

import { PopoverContext, SiteInfoContext } from "../Contexts";
import { Time } from "./Basic";
import { SmallRoleList, GameStateIcon } from "./Setup";
import { NameWithAvatar } from "../pages/User/User";
import { useErrorAlert } from "./Alerts";
import { GameStates, Alignments } from "../Constants";
import { useOnOutsideClick } from "./Basic";

import "../css/popover.css";

export default function Popover() {
	const popover = useContext(PopoverContext);
	const popoverRef = useRef();
	const triangleRef = useRef();

	useOnOutsideClick(
		[
			{ current: popover.boundingEl },
			popoverRef
		],
		() => {
			if (!popover.loadingRef.current) {
				popover.setVisible(false);
				popover.setBoundingEl(null);
			}
		}
	);

	useLayoutEffect(() => {
		if (!popover.visible)
			return;

		const boundingRect = popover.boundingEl.getBoundingClientRect();
		const popoverRect = popoverRef.current.getBoundingClientRect();

		var triangleLeft = boundingRect.left + boundingRect.width;
		var triangleTop = boundingRect.top - 10 + (boundingRect.height / 2) + window.scrollY;

		var popoverLeft = boundingRect.left + boundingRect.width + 10;
		var popoverTop = boundingRect.top - (popoverRect.height / 2) + (boundingRect.height / 2) + window.scrollY;
		var popoverHorzShift = window.innerWidth - (popoverLeft + popoverRect.width);

		if (popoverTop < window.scrollY)
			popoverTop = window.scrollY;

		if (popoverHorzShift < 0) {
			if (popoverLeft + popoverHorzShift < 0)
				popoverHorzShift -= (popoverLeft + popoverHorzShift);
		}
		else
			popoverHorzShift = 0;

		popoverLeft += popoverHorzShift;
		triangleLeft += popoverHorzShift;

		triangleRef.current.style.left = triangleLeft + "px";
		triangleRef.current.style.top = triangleTop + "px";
		triangleRef.current.style.visibility = "visible";

		popoverRef.current.style.top = popoverTop + "px";
		popoverRef.current.style.left = popoverLeft + "px";
		popoverRef.current.style.visibility = "visible";
	});

	return (
		popover.visible &&
		<>
			<div
				className="triangle triangle-left"
				ref={triangleRef} />
			<div
				className={`popover-window`}
				ref={popoverRef}>
				<div className="popover-title">
					{popover.title}
				</div>
				{!popover.loading &&
					<div className="popover-content">
						{popover.content}
					</div>
				}
			</div>
		</>
	);
}

export function usePopover(siteInfo) {
	const [visible, setVisible] = useState(false);
	const [boundingEl, setBoundingEl] = useState();
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [loading, setLoading] = useState(false);

	const loadingRef = useRef();
	const errorAlert = useErrorAlert(siteInfo);

	function onClick(path, type, _boundingEl, title, dataMod) {
		if (_boundingEl == boundingEl) {
			setVisible(false);
			setBoundingEl(null);
		}
		else
			load(path, type, _boundingEl, title, dataMod);
	}

	function open(boundingEl, title) {
		setBoundingEl(boundingEl);
		setTitle(title);
		setLoading(true);
		setVisible(true);

		loadingRef.current = true;
	}

	function ready(content, type) {
		switch (type) {
			case "setup":
				content = parseSetupPopover(content, siteInfo.roles);
				break;
			case "role":
				content = parseRolePopover(content);
				break;
			case "game":
				content = parseGamePopover(content);
				break;
		}

		setContent(content);
		setLoading(false);
	}

	function load(path, type, boundingEl, title, dataMod) {
		open(boundingEl, title);

		axios.get(path)
			.then(res => {
				if (dataMod)
					dataMod(res.data);

				loadingRef.current = false;
				ready(res.data, type)
			})
			.catch(errorAlert);
	}

	return {
		visible,
		setVisible,
		boundingEl,
		setBoundingEl,
		title,
		setTitle,
		content,
		setContent,
		loading,
		setLoading,
		onClick,
		open,
		ready,
		load,
		loadingRef
	};
}

function InfoRow(props) {
	return (
		<div className="info-row">
			<div className="title">{props.title}</div>
			<div className="content">{props.content}</div>
		</div>
	);
}

export function parseSetupPopover(setup, roleData) {
	const result = [];

	// ID
	result.push(<InfoRow title="ID" content={setup.id} key={-2} />);

	//Creator
	if (setup.creator) {
		const name =
			<NameWithAvatar
				small
				id={setup.creator.id}
				name={setup.creator.name}
				avatar={setup.creator.avatar} />
		result.push(<InfoRow title="Created By" content={name} key={-1} />);
	}

	//Total
	result.push(<InfoRow title="Players" content={setup.total} key={0} />);

	//Whispers
	const whisperContent = [];
	whisperContent.push(<div key={0}>{setup.whispers ? "Yes" : "No"}</div>);

	if (setup.whispers)
		whisperContent.push(<div key={1}>{setup.leakPercentage}% leak rate</div>);

	result.push(<InfoRow title="Whispers" content={whisperContent} key={1} />);

	//Must act
	result.push(<InfoRow title="Must Act" content={setup.mustAct ? "Yes" : "No"} key={2} />);

	//Game settings
	switch (setup.gameType) {
		case "Mafia":
			//Starting state
			result.push(<InfoRow title="Starting State" content={<GameStateIcon state={setup.startState} />} key={3} />);

			//Last will
			result.push(<InfoRow title="Last Will" content={setup.lastWill ? "Yes" : "No"} key={4} />);

			//No reveal
			result.push(<InfoRow title="No Reveal" content={setup.noReveal ? "Yes" : "No"} key={5} />);

			//Votes invisible
			result.push(<InfoRow title="Votes Invisible" content={setup.votesInvisible ? "Yes" : "No"} key={6} />);
			break;
		case "Split Decision":
			//Initial swap amount
			result.push(<InfoRow title="Initial Swap Amount" content={setup.swapAmt} key={3} />);

			//Round amount
			result.push(<InfoRow title="Round Amount" content={setup.roundAmt} key={4} />);
			break;
		case "Resistance":
			//First team size
			result.push(<InfoRow title="First Team Size" content={setup.firstTeamSize} key={3} />);

			//Last team size
			result.push(<InfoRow title="Last Team Size" content={setup.lastTeamSize} key={4} />);

			//Number of Missions
			result.push(<InfoRow title="Number of Missions" content={setup.numMissions} key={5} />);

			//Team Formation Attempts
			result.push(<InfoRow title="Team Formation Attempts" content={setup.teamFailLimit} key={6} />);
			break;
		case "One Night":
			//Votes invisible
			result.push(<InfoRow title="Votes Invisible" content={setup.votesInvisible ? "Yes" : "No"} key={3} />);

			//Excess roles
			result.push(<InfoRow title="Excess Roles" content={setup.excessRoles} key={4} />);
			break;
	}

	//Roles
	if (setup.closed) {
		result.push(<InfoRow title="Unique Roles" content={setup.unique ? "Yes" : "No"} key={7} />);

		const roleset = setup.roles[0];
		var rolesByAlignment = {};

		for (let role in roleset) {
			let roleName = role.split(":")[0];

			for (let roleObj of roleData[setup.gameType]) {
				if (roleObj.name == roleName) {
					let alignment = roleObj.alignment;

					if (!rolesByAlignment[alignment])
						rolesByAlignment[alignment] = {};

					rolesByAlignment[alignment][role] = roleset[role];
				}
			}
		}

		for (let alignment in rolesByAlignment) {
			result.push(
				<InfoRow
					title={`${alignment} roles`}
					content={
						<SmallRoleList
							roles={rolesByAlignment[alignment]}
							gameType={setup.gameType} />
					}
					key={alignment} />
			);
		}
	}
	else {
		const rolesets = [];
		const sectionName = setup.roles.length > 1 ? "Role Sets" : "Roles";

		for (let i in setup.roles) {
			let roleset = setup.roles[i];
			rolesets.push(
				<SmallRoleList
					roles={roleset}
					gameType={setup.gameType}
					key={i} />
			);
		}

		result.push(<InfoRow title={sectionName} content={rolesets} key={7} />);
	}

	return result;
}

export function parseGamePopover(game) {
	const result = [];

	//Scheduled
	if (game.settings.scheduled)
		result.push(<InfoRow title="Scheduled For" content={(new Date(game.settings.scheduled)).toLocaleString()} key={-1} />);

	//Players
	const playerList = [];

	for (let i = 0; i < game.players.length; i++)
		playerList.push(
			<NameWithAvatar
				small
				id={game.players[i].id}
				name={game.players[i].name}
				avatar={game.players[i].avatar}
				key={game.players[i].id} />
		);

	result.push(<InfoRow title="Players" content={playerList} key={0} />);

	//State lengths
	const stateLengths = [];

	for (let stateName of GameStates[game.type]) {
		stateLengths.push(<div key={stateName}>{stateName}: <Time millisec={game.settings.stateLengths[stateName]} /></div>);
	}

	result.push(<InfoRow title="State Lengths" content={stateLengths} key={1} />);

	//Ranked
	result.push(<InfoRow title="Ranked" content={game.settings.ranked ? "Yes" : "No"} key={2} />);

	//Spectating
	result.push(<InfoRow title="Spectating" content={game.settings.spectating ? "Yes" : "No"} key={3} />);

	switch (game.type) { }

	//Created at
	if (game.createTime)
		result.push(<InfoRow title="Created At" content={(new Date(game.createTime)).toLocaleString()} key={5} />);

	//Started at
	if (game.startTime)
		result.push(<InfoRow title="Started At" content={(new Date(game.startTime)).toLocaleString()} key={6} />);

	//Ended at
	if (game.endTime)
		result.push(<InfoRow title="Ended At" content={(new Date(game.endTime)).toLocaleString()} key={7} />);

	return result;
}

export function parseRolePopover(role) {
	const result = [];

	//Alignment
	result.push(<InfoRow title="Alignment" content={role.alignment} key={0} />);

	//Description
	const descLines = [];

	for (let i in role.description)
		descLines.push(<li key={i}>{role.description[i]}</li>);

	result.push(<InfoRow title="Description" content={<ul>{descLines}</ul>} key={1} />);

	return result;
}