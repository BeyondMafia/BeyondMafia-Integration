import React, { useState, useEffect, useContext } from "react";
import axios from "axios";

import { UserContext, SiteInfoContext } from "../../Contexts";
import { useErrorAlert } from "../../components/Alerts";
import { NameWithAvatar, StatusIcon } from "../User/User";

import "../../css/userSearch.css";

export default function Settings(props) {
	const [userList, setUserList] = useState([]);
	const [searchVal, setSearchVal] = useState("");

	useEffect(() => {
		axios.get("/user/online")
			.then(res => {
				setUserList(res.data);
			})
			.catch(useErrorAlert);
	}, []);

	useEffect(() => {
		if (searchVal.length > 0) {
			axios.get(`/user/searchName?query=${searchVal}`)
				.then(res => {
					setUserList(res.data);
				})
				.catch(useErrorAlert);
		}
		else {
			axios.get("/user/online")
				.then(res => {
					setUserList(res.data);
				})
				.catch(useErrorAlert);
		}
	}, [searchVal]);

	const users = userList.map(user => (
		<div className="user-cell">
			<NameWithAvatar
				id={user.id}
				name={user.name}
				avatar={user.avatar} />
			<StatusIcon status={user.status} />
		</div>
	));

	return (
		<div className="span-panel user-search">
			<div className="form">
				<input 
					type="text"
					placeholder="Username"
					value={searchVal}
					onChange={(e) => setSearchVal(e.target.value)} />
			</div>
			<div className="users">
				{users}
			</div>
		</div>
	);
}