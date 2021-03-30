import React, { useContext } from "react";
import { Redirect } from "react-router-dom";

import { UserContext } from "../../Contexts";

export default function SigninDiscord() {
	const user = useContext(UserContext);

	if (user.loaded && user.loggedIn)
		return <Redirect to="/play" />;

	return (
		<div className="inner-content signin-content">
			<div>
				<a className="btn signin" href="http://localhost:3000/auth/discord">Signin with Discord</a>
				{/* <a class="btn signin" href="http://localhost:3000/auth/twitch">Signin with Twitch</a> */}
			</div>
			<div className="separator-text">
				and join the server
			</div>
			<div>
				<iframe src="https://discordapp.com/widget?id=458148658987401229&theme=dark" allowtransparency="true" frameBorder="0"></iframe>
			</div>
			<div className="accept-tos">
				By logging in with Discord, you accept our <a href="https://discordapp.com/channels/458148658987401229/462326103395139603">Terms of Service</a> and agree to follow our <a href="https://discordapp.com/channels/458148658987401229/458153196922077187">rules.</a>
			</div>
		</div>
	);
}