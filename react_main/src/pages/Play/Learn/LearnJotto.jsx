
import React, { useEffect } from "react";

import { RoleSearch } from "../../../components/Roles";

import "../../../css/learn.css";

export default function LearnJotto(props) {
	const gameType = "Jotto";

	useEffect(() => {
		document.title = "Learn Mafia | BeyondMafia";
	}, []);

	return (
		<div className="span-panel main">
			<div className="learn">
				<div className="heading">
					Synopsis
				</div>
				<div className="paragraphs">
					<div className="paragraph">
						WIP
					</div>
				</div>
				<div className="heading">
					Roles
				</div>
				<RoleSearch gameType={gameType} />
			</div>
		</div>
	);
}

