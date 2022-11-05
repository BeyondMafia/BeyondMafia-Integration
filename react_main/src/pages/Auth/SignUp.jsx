import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from "firebase/auth";
import axios from "axios";

import LoadingPage from "../Loading";
import { useErrorAlert } from "../../components/Alerts";

export default function SignUp() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [passwordConf, setPasswordConf] = useState("");
	const [submitDisabled, setSubmitDisabled] = useState(true);
	const [loading, setLoading] = useState(false);
	const errorAlert = useErrorAlert();

	useEffect(() => {
		document.title = "Sign Up | BeyondMafia";
	}, []);

	useEffect(() => {
		setSubmitDisabled(email.length == 0 || password.length == 0 || password != passwordConf);
	}, [email, password, passwordConf]);

	async function onSubmit(e) {
		try {
			e.preventDefault();

			if (submitDisabled)
				return;

			setLoading(true);

			const auth = getAuth();
			const userCred = await createUserWithEmailAndPassword(auth, email, password);
			const idToken = await userCred.user.getIdToken(true);
			axios.post("/auth", { idToken })
				.then(() => {
					window.location.reload();
				})
				.catch(errorAlert);
		} catch (e) {
			setLoading(false);

			switch (e.message) {
				case "Firebase: Error (auth/invalid-email).":
					errorAlert("Invalid email.");
					break;
				case "Firebase: Password should be at least 6 characters (auth/weak-password).":
					errorAlert("Password should be at least 6 characters");
					break;
				case "Firebase: Error (auth/email-already-in-use).":
					errorAlert("Email already in use.")
					break;
				default:
					errorAlert("Error signing up.");
			}
		}
	}

	if (loading)
		return <LoadingPage />;

	return (
		<div className="span-panel login">
			<form onSubmit={onSubmit}>
				<div className="input-wrapper">
					<label>Email</label>
					<input type="text" value={email} onChange={e => setEmail(e.target.value)} />
				</div>
				<div className="input-wrapper">
					<label>Password</label>
					<input type="password" value={password} onChange={e => setPassword(e.target.value)} />
				</div>
				<div className="input-wrapper">
					<label>Confirm Password</label>
					<input type="password" value={passwordConf} onChange={e => setPasswordConf(e.target.value)} />
				</div>
				<input className={`auth-btn ${submitDisabled ? "disabled" : ""}`} type="submit" value="Sign Up" />
			</form>
			<div className="legal">
				By signing up you agree to follow our <Link to="/legal/tos">Terms of Service </Link>
				and accept our <Link to="/legal/privacy">Privacy Policy</Link>.
			</div>
		</div>
	);
}
