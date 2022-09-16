import React, { useEffect } from "react";
import { Link } from "react-router-dom";

import "../../css/signin.css";

export default function SignUp() {
	useEffect(() => {
		document.title = "Sign In | BeyondMafia";
	}, []);

	return (
		<div className="span-panel signin">
			<div className="legal">
				By signing in you agree to follow our <Link to="/legal/tos">Terms of Service </Link>
				and accept our <Link to="/legal/privacy">Privacy Policy</Link>.
			</div>
		</div>
	);
}
