import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import axios from "axios";

import LoadingPage from "../Loading";
import { useErrorAlert } from "../../components/Alerts";

export default function LogIn() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [submitDisabled, setSubmitDisabled] = useState(true);
	const [loading, setLoading] = useState(false);
	const errorAlert = useErrorAlert();

	useEffect(() => {
		document.title = "Log In | BeyondMafia";
	}, []);

	useEffect(() => {
		setSubmitDisabled(email.length == 0 || password.length == 0);
	}, [email, password]);

	async function onSubmit(e) {
		try {
			e.preventDefault();

			if (submitDisabled)
				return;

			setLoading(true);

			const auth = getAuth();
			const userCred = await signInWithEmailAndPassword(auth, email, password);
			const idToken = await userCred.user.getIdToken(true);
			axios.post("/auth", { idToken })
				.then(() => {
					window.location.reload();
				})
				.catch(errorAlert);
		} catch (e) {
			errorAlert("Error logging in.");
			setLoading(false);
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
				<input className={`auth-btn ${submitDisabled ? "disabled" : ""}`} type="submit" value="Log In" />
			</form>
			<div className="legal">
				By logging in you agree to follow our <Link to="/legal/tos">Terms of Service </Link>
				and accept our <Link to="/legal/privacy">Privacy Policy</Link>.
			</div>
		</div>
	);
}
