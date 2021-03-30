import React from "react";

import "../css/landing.css"

export default function LandingPage(props) {
	return (
		<div className="span-panel landing-page">
			<div className="center">
				EpicMafia is reborn as <i>EpicMafia.org</i>!
			</div>
			<div className="role-banner" />
			<div className="paragraph">
				EpicMafia.org is owned in full by the EpicMafia Community Organization, a nonprofit dedicated to the former EpicMafia community. The site is completely free and always will be. The source code is publically viewable and anyone can contribute. Site administrators are appointed by a democratic process. This is <i>your</i> website.
			</div>
			<div className="paragraph">
				The site features 40+ roles, 4 social deception games, integrated voice chat for games, forums, profiles, and more.
			</div>
			<div className="paragraph">
				To play, <a href="/signin" className="btn btn-theme">click here</a> to sign in with one of several third-party accounts.
			</div>
		</div>
	);
}