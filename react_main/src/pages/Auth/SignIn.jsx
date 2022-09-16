import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import "../../css/signin.css";

export default function SignIn() {
	const errorAlert = useErrorAlert();

	useEffect(() => {
		document.title = "Sign In | BeyondMafia";
	}, []);

	async function onSubmit(email, password) {
		try {
			const auth = getAuth();
			const userCred = await signInWithEmailAndPassword(auth, email, password);
			const idToken = await userCred.getIdToken();
			axios.post("/auth", { idToken })
				.then(() => {
					window.refresh();
				})
				.catch(errorAlert);
		} catch (e) {
			errorAlert("Error signing in.");
		}
	}

	return (
		<div className="span-panel signin">
			<div className="legal">
				By signing in you agree to follow our <Link to="/legal/tos">Terms of Service </Link>
				and accept our <Link to="/legal/privacy">Privacy Policy</Link>.
			</div>
		</div>
	);
}
