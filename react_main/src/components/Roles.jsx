import React, { useState, useContext, useRef } from "react";
import axios from "axios";

import { UserContext, SiteInfoContext, PopoverContext, GameContext } from "../Contexts";
import { ButtonGroup, SearchBar } from "./Nav";
import { useErrorAlert } from "./Alerts";
import { hyphenDelimit } from "../utils";
import { Alignments } from "../Constants";
import LoadingPage from "../pages/Loading";
import { TopBarLink } from "../pages/Play/Play";

export function RoleCount(props) {
	const roleRef = useRef();
	const popover = useContext(PopoverContext);
	const game = useContext(GameContext);

	// Display predicted icon
	const isRolePrediction = props.isRolePrediction;
	const toggleRolePrediction = props.toggleRolePrediction;
	// Choose from list of icons to predict from
	const makeRolePrediction = props.makeRolePrediction;

	var roleName, modifier;

	if (typeof props.role == "string") {
		roleName = props.role.split(":")[0];
		modifier = props.role.split(":")[1];
	}
	else if (props.role) {
		roleName = props.role.name;
		modifier = props.role.modifier;
	}

	if (isRolePrediction) {
		modifier = "Unknown";
	}

	function onRoleClick() {
		if (props.onClick)
			props.onClick();

		if (toggleRolePrediction) {
			popover.onClick(
				`/setup/${game.setup.id}`,
				"rolePrediction",
				roleRef.current,
				"Mark Role as",
				data => {
					data.roles = JSON.parse(data.roles)[0];
					data.toggleRolePrediction = toggleRolePrediction;
				}
			)
			return;
		}

		if (makeRolePrediction) {
			makeRolePrediction(roleName);
			return;
		}

		if (!roleName || !props.showPopover)
			return;

		popover.onHover(
			`/roles/${props.gameType}/${roleName}`,
			"role",
			roleRef.current,
			roleName
		);
	}

	function onRoleMouseEnter( event ) {
		if (props.onMouseEnter)
			props.onMouseEnter();

		if (!roleName || !props.showSecondaryHover)
			return;

		// assumes that this is attached to a child in a popover
		popover.onHover(
			`/roles/${props.gameType}/${roleName}`,
			"role",
			roleRef.current,
			roleName,
			null,
			event.clientY,
		);
	}

	if (!props.closed) {
		const roleClass = roleName ? `${hyphenDelimit(props.gameType)}-${hyphenDelimit(roleName)}` : "null";

		return (
			<div className="role-count-wrap">
				<div
					className={`role role-${roleClass} ${props.small ? "small" : ""} ${props.bg ? "bg" : ""}`}
					title={`${roleName || ""} ${modifier ? `(${modifier})` : ""}`}
					onClick={onRoleClick}
					onMouseEnter={onRoleMouseEnter}
					ref={roleRef}>
					{modifier &&
						<div className={`modifier modifier-${props.gameType}-${hyphenDelimit(modifier)}`} />
					}
				</div>
				{props.count > 0 &&
					<div className="super">{props.count}</div>
				}
			</div>
		);
	}
	else if (props.count > 0 || props.hideCount) {
		return (
			<div className="role-count-wrap">
				<i
					className={`fas fa-question i-${props.alignment}`}
					onClick={props.onClick} />
				{!props.hideCount &&
					<div className="super">{props.count}</div>
				}
			</div>
		);
	}
	else {
		return <></>;
	}
}

export function RoleSearch(props) {
	const [roleListType, setRoleListType] = useState(Alignments[props.gameType][0]);
	const [searchVal, setSearchVal] = useState("");
	const roleCellRefs = useRef([]);
	const errorAlert = useErrorAlert();
	const user = useContext(UserContext);
	const siteInfo = useContext(SiteInfoContext);
	const popover = useContext(PopoverContext);

	function onAlignNavClick(alignment) {
		setSearchVal("");
		setRoleListType(alignment);
	}

	function onSearchInput(query) {
		setSearchVal(query.toLowerCase());

		if (query != "" && roleListType.length > 0)
			setRoleListType("");
		else if (query == "" && roleListType.length == 0)
			setRoleListType(Alignments[props.gameType][0]);
	}

	function onRoleCellClick(roleCellEl, role) {
		popover.onClick(
			`/roles/${props.gameType}/${role.name}`,
			"role",
			roleCellEl,
			role.name
		);
	}

	const alignButtons = Alignments[props.gameType].map(type => (
		<TopBarLink
			text={type}
			sel={roleListType}
			onClick={() => onAlignNavClick(type)}
			key={type} />
	));

	if (!siteInfo.roles)
		return <LoadingPage className="roles-loading" />;

	const roleCells = siteInfo.roles[props.gameType].map((role, i) => {
		if (
			role.alignment == roleListType && !role.disabled ||
			(searchVal.length > 0 && role.name.toLowerCase().indexOf(searchVal) != -1)
		) {
			return (
				<div className="role-cell" key={role.name}>
					{user.loggedIn && props.onAddClick &&
						<i
							className="add-role fa-plus-circle fas"
							onClick={e => {
								e.stopPropagation();
								props.onAddClick(role);
							}} />
					}
					<div
						className="role-cell-content"
						onClick={() => onRoleCellClick(roleCellRefs.current[i], role)}
						ref={el => roleCellRefs.current[i] = el}>
						<RoleCount
							role={role.name}
							gameType={props.gameType} />
						{role.name}
					</div>
				</div>
			);
		}
	});

	return (
		<div className="role-list-container">
			<div className="top-bar">
				{alignButtons}
				<SearchBar
					value={searchVal}
					placeholder="Role Name"
					onInput={onSearchInput} />
			</div>
			<div className="role-list">
				{roleCells}
			</div>
		</div>
	);
}
