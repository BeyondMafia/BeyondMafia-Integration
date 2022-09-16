import React, { useContext, useEffect } from "react";
import { Link, Redirect, useLocation } from "react-router-dom";
import axios from "axios";

import { UserContext } from "../../Contexts";
import { SubNav } from "../../components/Nav";
import { ItemList } from "../../components/Basic";
import { capitalize } from "../../utils";
import { useErrorAlert } from "../../components/Alerts";

import "../../css/signin.css"
import LoadingPage from "../Loading";

export default function SignUp() {
	const user = useContext(UserContext);
	const location = useLocation();
	const links = [
		{
			text: "Sign In",
			path: "/signin",
			exact: true
		}
	];

	useEffect(() => {
		document.title = "Sign In | EpicMafia";

		const params = new URLSearchParams(location.search);

		if (params.get("ref"))
			window.localStorage.setItem("referrer", params.get("ref"));
	}, []);

	if (!user.loaded)
		return <LoadingPage />;
	else if (user.loggedIn)
		return <Redirect to="/play" />;

	return (
		<>
			<SubNav links={links} />
			<div className="inner-content">
				<div className="span-panel signin">
					<SignUpButtons signin />
					<div className="legal">
						By signing in you agree to follow our <Link to="/legal/tos">Terms of Service </Link>
						and accept our <Link to="/legal/privacy">Privacy Policy</Link>.
					</div>
				</div>
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