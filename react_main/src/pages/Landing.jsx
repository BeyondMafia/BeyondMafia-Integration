import React from "react";
import { Link } from "react-router-dom";

import "../css/landing.css"

export default function LandingPage(props) {
	return (
		<div className="span-panel landing-page">
			<div className="center">
				Welcome to BeyondMafia!
			</div>
			<div className="role-banner" />
			<div className="paragraph">
				BeyondMafia is the spiritual successor to EpicMafia. The site is completely free and always will be. The source code is publically viewable and anyone can contribute.
			</div>
			<div className="paragraph">
				The site features 50+ roles, 4 social deception games, integrated voice chat, forums, profiles, and more.
			</div>
			<div className="paragraph">
				To play, <Link to="/auth/signup" className="btn btn-theme">click here</Link> to create an account.
			</div>
		</div>
	);
}