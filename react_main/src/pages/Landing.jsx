import React from "react";
import { Link } from "react-router-dom";

import "../css/landing.css"

export default function LandingPage(props) {
	return (
		<div className="span-panel main landing-page">
			<div className="banner">
				<div className="logo" />
				<div className="characters-circle" />
			</div>
			<div className="play-break">
				<div class="play-btn-wrapper">
					<Link to="/auth/signup">
						Play Mafia
					</Link>
				</div>
			</div>
			<div className="intro">
				BeyondMafia is the mafia site that is revolutionary in design, safety, and has a thriving community of users from all walks of life. With competitive and casual live mafia, and other gamemodes like Resistance, you're sure to find something that suits how YOU want to play.
			</div>
			<div class="mafia-features">
				<div class="chat-mafia">
					<div class="village-character" />
					<div class="feature-title">Chat Mafia</div>
					<div class="feature-desc">
						10-20 minute games with a variety of roles! Play wiht classic roles, or try out something different in the Sandbox lobby. You can create your own custom roles, too, using modifiers or by contributing to the open source codebase!
					</div>
				</div>
				<div class="forum-mafia">
					<div class="cop-character" />
					<div class="feature-title">Forum Mafia</div>
					<div class="feature-desc">
						Play Mafia in the forums. More features are coming soon with the planned forum game engine!
					</div>
				</div>
			</div>
			<div class="other-games">
				<div class="other-games-img" />
				<div class="feature-title">Other Games</div>
				<div class="feature-desc">
					Explore other Mafia-esque games like Resistance, One Night Ultimate Werewolf, and 2 Rooms and a Boom.
				</div>
			</div>
			<div className="play-break">
				<div class="play-btn-wrapper">
					<Link to="/auth/signup">
						Play Mafia
					</Link>
				</div>
			</div>
		</div>
	);
}