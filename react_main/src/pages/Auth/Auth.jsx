import React, { useContext, useEffect } from "react";
import { Redirect, Switch, Route, useLocation } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import axios from "axios";

import SignIn from "./SignIn";
import SignUp from "./SignUp";
import { UserContext } from "../../Contexts";
import { SubNav } from "../../components/Nav";
import { ItemList } from "../../components/Basic";
import { capitalize } from "../../utils";
import { useErrorAlert } from "../../components/Alerts";

import "../../css/signin.css"
import LoadingPage from "../Loading";

export default function Auth() {
	const user = useContext(UserContext);
	const location = useLocation();
	const links = [
		{
			text: "Sign In",
			path: "/auth/signin",
			exact: true
		},
		{
			text: "Sign Up",
			path: "/auth/signup",
			exact: true
		}
	];

	useEffect(() => {
		const params = new URLSearchParams(location.search);

		if (params.get("ref"))
			window.localStorage.setItem("referrer", params.get("ref"));

		const fbConfig = {
			apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
			authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
			projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
			storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
			messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
			appId: process.env.REACT_APP_FIREBASE_APP_ID,
			measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
		};
		initializeApp(fbConfig);
		getAuth().setPersistence(firebase.auth.Auth.Persistence.NONE);
	}, []);

	if (!user.loaded)
		return <LoadingPage />;
	else if (user.loggedIn)
		return <Redirect to="/play" />;

	return (
		<>
			<SubNav links={links} />
			<div className="inner-content">
				<Switch>
					<Route exact path="/auth/signin">
						<SignIn />
					</Route>
					<Route exact path="/auth/signup">
						<SignUp />
					</Route>
					<Route render={() => <Redirect to="/auth/signin" />} />
				</Switch>
			</div>
		</>
	);
}

export function SignUpButtons(props) {
	const errorAlert = useErrorAlert()
	const buttons = ["discord", "twitch", "google", "steam"];
	var buttonMap;

	if (props.signin) {
		buttonMap = (button, i) => (
			<a
				className={`btn signin-btn signin-with-${button}`}
				href={`${process.env.REACT_APP_URL}/auth/${button}`}
				key={button}>
				<div className="signin-icon" style={{ backgroundImage: `url(images/icons/${button}.png)` }} />
				Sign in with {capitalize(button)}
			</a>
		);

	}
	else if (props.link) {
		buttonMap = (button, i) => (
			(!props.accounts[button] || !props.accounts[button].id) &&
			<a
				className={`btn signin-btn signin-with-${button}`}
				href={`${process.env.REACT_APP_URL}/auth/${button}`}
				key={button}>
				<div className="signin-icon" />
				Link {capitalize(button)}
			</a>
		);
	}
	else if (props.unlink) {
		let accountCount = 0;

		function onUnlinkClick(account) {
			axios.post("/user/unlink", { account })
				.then(res => {
					props.setAccounts(res.data);
				})
				.catch(errorAlert);
		}

		for (let account in props.accounts) {
			if (props.accounts[account].id)
				accountCount++;
		}

		if (accountCount > 1) {
			buttonMap = (button, i) => (
				props.accounts[button] && props.accounts[button].id &&
				<div
					className={`btn signin-btn signin-with-${button}`}
					onClick={() => onUnlinkClick(button)}
					key={button}>
					<div className="signin-icon" />
					Unlink {capitalize(button)}
				</div>
			);
		}
		else
			buttonMap = () => { };
	}

	return (
		<ItemList
			className="signin-buttons"
			items={buttons}
			map={buttonMap} />
	);
}