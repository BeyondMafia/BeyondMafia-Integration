import React from "react";

export default function New() {
	return (
		<div className="site-wrapper">
			<div className="top-bar dark2">
				<div className="logo no-highlight">
					<span className="text-theme">Arc</span>Mafia
				</div>
				<div className="user-nav">
					User
				</div>
			</div>
			<div className="main dark1">
				<div className="left-bar dark2">
					<div className="section">
						<div className="title">
							Game
						</div>
						<div className="nav-row sel">
							<i className="fa fa-play" />
							Play
						</div>
						<div className="nav-row">
							<i className="fa fa-tools" />
							Create Setup
						</div>
						<div className="nav-row">
							<i className="fa fa-graduation-cap" />
							Learn
						</div>
					</div>
				</div>
				<div className="site-content">
					<div className="panel dark2">
						
					</div>
				</div>
			</div>
		</div>
	);
}