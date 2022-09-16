import React, { useState, useEffect, useContext } from "react";
import { Redirect, useParams, useHistory } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from "react-markdown";

import { UserContext, SiteInfoContext } from "../../Contexts";
import { Avatar, NameWithAvatar } from "./User";
import { HiddenUpload, TextEditor } from "../../components/Form";
import LoadingPage from "../Loading";
import Setup from "../../components/Setup";
import { GameRow } from "../Play/Join";
import { Time, filterProfanity } from "../../components/Basic";
import { useErrorAlert } from "../../components/Alerts";
import { PageNav } from "../../components/Nav";
import { RatingThresholds, RequiredTotalForStats } from "../../Constants";
import { capitalize } from "../../utils";
import Comments from "../Community/Comments";

import "../../css/user.css";

export default function Profile() {
	const [profileLoaded, setProfileLoaded] = useState(false);
	const [name, setName] = useState();
	const [avatar, setAvatar] = useState();
	const [banner, setBanner] = useState();
	const [bio, setBio] = useState("");
	const [oldBio, setOldBio] = useState();
	const [editingBio, setEditingBio] = useState(false);
	const [isFriend, setIsFriend] = useState(false);
	const [settings, setSettings] = useState({});
	const [accounts, setAccounts] = useState({});
	const [recentGames, setRecentGames] = useState([]);
	const [createdSetups, setCreatedSetups] = useState([]);
	const [bustCache, setBustCache] = useState(false);
	const [friendsPage, setFriendsPage] = useState(1);
	const [maxFriendsPage, setMaxFriendsPage] = useState(1);
	const [friends, setFriends] = useState([]);
	const [friendRequests, setFriendRequests] = useState([]);
	const [stats, setStats] = useState({ Mafia: {} });

	const user = useContext(UserContext);
	const siteInfo = useContext(SiteInfoContext);
	const history = useHistory();
	const errorAlert = useErrorAlert();
	const { userId } = useParams();

	const isSelf = userId == user.id;
	const isBlocked = !isSelf && user.blockedUsers.indexOf(userId) != -1;

	useEffect(() => {
		if (bustCache)
			setBustCache(false);
	}, [bustCache]);

	useEffect(() => {
		if (userId) {
			setProfileLoaded(false);

			axios.get(`/user/${userId}/profile`)
				.then(res => {
					setProfileLoaded(true);
					setName(res.data.name);
					setAvatar(res.data.avatar);
					setBanner(res.data.banner);
					setBio(filterProfanity(res.data.bio, "\\*") || "");
					setIsFriend(res.data.isFriend);
					setSettings(res.data.settings);
					setAccounts(res.data.accounts || {});
					setRecentGames(res.data.games);
					setCreatedSetups(res.data.setups);
					setMaxFriendsPage(res.data.maxFriendsPage);
					setFriendRequests(res.data.friendRequests);
					setStats(res.data.stats);

					document.title = `${res.data.name}'s Profile | BeyondMafia`;
				})
				.catch(e => {
					errorAlert(e);
					history.push("/play");
				});

			axios.get(`/user/${userId}/friends`)
				.then((res) => {
					setFriends(res.data);
				})
				.catch(errorAlert);
		}
	}, [userId]);

	function onEditBanner(files, type) {
		if (!user.itemsOwned.customProfile) {
			errorAlert("You must purchase profile customization with coins from the Shop.");
			return false;
		}

		return true;
	}

	function onFileUpload(files, type) {
		if (files.length) {
			const formData = new FormData();
			formData.append("image", files[0]);

			for (let el of document.getElementsByClassName("hidden-upload"))
				el.value = "";

			axios.post(`/user/${type}`, formData)
				.then(res => {
					switch (type) {
						case "avatar":
							setAvatar(true);
							siteInfo.clearCache();
							break;
						case "banner":
							setBanner(true);
							siteInfo.clearCache();
							break;
					}
				})
				.catch(errorAlert);
		}
	}

	function onFriendUserClick() {
		if (isFriend) {
			var shouldUnfriend = window.confirm("Are you sure you wish to unfriend or cancel your friend request?");
			if (!shouldUnfriend)
				return;
		}

		axios.post("/user/friend", { user: userId })
			.then((res) => {
				setIsFriend(!isFriend);
				siteInfo.showAlert(res.data, "success");
			})
			.catch(errorAlert);
	}

	function onBlockUserClick() {
		if (!isBlocked) {
			var shouldBlock = window.confirm("Are you sure you wish to block this user?");
			if (!shouldBlock)
				return;
		}

		axios.post("/user/block", { user: userId })
			.then(() => {
				user.blockUserToggle(userId);

				if (isBlocked)
					siteInfo.showAlert("User unblocked.", "success");
				else
					siteInfo.showAlert("User blocked.", "success");
			})
			.catch(errorAlert);
	}

	function onBioClick() {
		setEditingBio(isSelf);
		setOldBio(bio);
	}

	function onEditBio(e) {
		axios.post(`/user/bio`, { bio: bio })
			.then(() => {
				setEditingBio(false);
				setBio(filterProfanity(bio, "\\*"));
			})
			.catch(errorAlert);
	}

	function onCancelEditBio(e) {
		e.stopPropagation();
		setEditingBio(false);
		setBio(oldBio);
	}

	function onAcceptFriend(_userId) {
		axios.post("/user/friend", { user: _userId })
			.then((res) => {
				var newFriendRequests = friendRequests.slice().filter(u => u.id != _userId);
				setFriendRequests(newFriendRequests);
				siteInfo.showAlert(res.data, "success");
			})
			.catch(errorAlert);
	}

	function onRejectFriend(_userId) {
		axios.post("/user/friend/reject", { user: _userId })
			.then((res) => {
				var newFriendRequests = friendRequests.slice().filter(u => u.id != _userId);
				setFriendRequests(newFriendRequests);
				siteInfo.showAlert(res.data, "success");
			})
			.catch(errorAlert);
	}

	function onFriendsPageNav(page) {
		var filterArg;

		if (page == 1)
			filterArg = "last=Infinity";
		else if (page == maxFriendsPage)
			filterArg = "first=-1";
		if (page < friendsPage)
			filterArg = `first=${friends[0].lastActive}`;
		else if (page > friendsPage)
			filterArg = `last=${friends[friends.length - 1].lastActive}`;
		else
			return;

		axios.get(`/user/${userId}/friends?${filterArg}`)
			.then(res => {
				setFriends(res.data);
				setFriendsPage(page);
			})
			.catch(errorAlert);
	}

	const mainPanelStyle = {};
	const bannerStyle = {};

	if (settings.backgroundColor)
		mainPanelStyle.backgroundColor = settings.backgroundColor;

	if (banner)
		bannerStyle.backgroundImage = `url(/uploads/${userId}_banner.jpg?t=${siteInfo.cacheVal})`;

	if (settings.bannerFormat == "stretch")
		bannerStyle.backgroundSize = "100% 100%";

	var ratings;

	ratings = Object.keys(stats["Mafia"]).map(statName => {
		var stat = stats["Mafia"][statName];

		if (stat.total < RequiredTotalForStats)
			stat = "-";
		else if (statName == "wins")
			stat = `${Math.round((stat.count / stat.total) * 100)}%`;
		else {
			var letter = "F";
			var letters = Object.keys(RatingThresholds[statName]).reverse();
			var i = 0;

			stat = stat.count / stat.total;

			while (stat >= RatingThresholds[statName][letters[i]] && i < letters.length)
				letter = letters[i++];

			stat = letter;
		}

		return (
			<div className="rating" key={statName}>
				<div className="name">
					{capitalize(statName)}
				</div>
				<div className="score">
					{stat}
				</div>
			</div>
		);
	});

	const recentGamesRows = recentGames.map(game => (
		<GameRow
			game={game}
			type={game.status || "Finished"}
			key={game.id}
			smallSetup />
	));

	const createdSetupRows = createdSetups.map(setup => (
		<Setup setup={setup} key={setup.id} />
	));

	const friendRequestRows = friendRequests.map(user => (
		<div className="friend-request" key={user.id}>
			<NameWithAvatar
				id={user.id}
				name={user.name}
				avatar={user.avatar} />
			<div className="btns">
				<i
					className="fas fa-check"
					onClick={() => onAcceptFriend(user.id)} />
				<i
					className="fas fa-times"
					onClick={() => onRejectFriend(user.id)} />
			</div>
		</div>
	));

	const friendRows = friends.map(friend => (
		<div className="friend" key={friend.id}>
			<NameWithAvatar
				id={friend.id}
				name={friend.name}
				avatar={friend.avatar} />
			<div className="last-active">
				<Time
					minSec
					millisec={Date.now() - friend.lastActive}
					suffix=" ago" />
			</div>
		</div>
	));

	if (user.loaded && !user.loggedIn && !userId)
		return <Redirect to="/play" />;

	if (user.loaded && user.loggedIn && !userId)
		return <Redirect to={`/user/${user.id}`} />;

	if (!profileLoaded || !user.loaded)
		return <LoadingPage />;

	return (
		<>
			<div className="profile">
				<div className="main-panel" style={mainPanelStyle}>
					<div className="banner" style={bannerStyle}>
						{isSelf &&
							<HiddenUpload
								className="edit"
								name="banner"
								onClick={onEditBanner}
								onFileUpload={onFileUpload}>
								<i className="far fa-file-image" />
							</HiddenUpload>
						}
					</div>
					<div className="user-info">
						<div className="avi-name-row">
							<div className="avi-name">
								{!bustCache &&
									<Avatar
										large
										id={userId}
										hasImage={avatar}
										bustCache={bustCache}
										name={name}
										edit={isSelf}
										onUpload={onFileUpload} />
								}
								<div className="name">
									{name}
								</div>
							</div>
						</div>
						{!isSelf && user.loggedIn &&
							<div className="options">
								<i
									className={`fas fa-user-plus ${isFriend ? "sel" : ""}`}
									onClick={onFriendUserClick} />
								<i
									className={`fas fa-ban ${isBlocked ? "sel" : ""}`}
									onClick={onBlockUserClick}
									title="Block user" />
							</div>
						}
						<div className="accounts">
							{accounts.discord && settings.showDiscord &&
								<div className="account-badge">
									<div className="icon discord-icon" />
									<div className="username-wrapper">
										<div className="username">
											{accounts.discord}
										</div>
									</div>
								</div>
							}
							{accounts.twitch && settings.showTwitch &&
								<div className="account-badge">
									<div className="icon twitch-icon" />
									<div className="username-wrapper">
										<div className="username">
											{accounts.twitch}
										</div>
									</div>
								</div>
							}
							{accounts.steam && settings.showSteam &&
								<div className="account-badge">
									<div className="icon steam-icon" />
									<div className="username-wrapper">
										<div className="username">
											{accounts.steam}
										</div>
									</div>
								</div>
							}
						</div>
						<div
							className={`bio ${isSelf && !editingBio ? "edit" : ""}`}
							onClick={onBioClick}>
							{!editingBio &&
								<div className="md-content">
									<ReactMarkdown source={bio} />
								</div>
							}
							{editingBio &&
								<>
									<TextEditor
										value={bio}
										onChange={setBio} />
									<div className="buttons">
										<div className="btn btn-theme" onClick={onEditBio}>Submit</div>
										<div className="btn btn-theme-sec" onClick={onCancelEditBio}>Cancel</div>
									</div>
								</>
							}
						</div>
					</div>
				</div>
				<div className="side column">
					{ratings.length > 0 &&
						<div className="box-panel ratings">
							<div className="heading">
								Mafia Ratings
							</div>
							<div className="content">
								{ratings}
							</div>
						</div>
					}
					<div className="box-panel recent-games">
						<div className="heading">
							Recent Games
						</div>
						<div className="content">
							{recentGamesRows}
							{recentGames.length == 0 &&
								"No games"
							}
						</div>
					</div>
					{friendRequests.length > 0 &&
						<div className="box-panel friend-requests">
							<div className="heading">
								Friend Requests
							</div>
							<div className="content">
								{friendRequestRows}
							</div>
						</div>
					}
					<div className="box-panel friends">
						<div className="heading">
							Friends
						</div>
						<div className="content">
							<PageNav
								page={friendsPage}
								maxPage={maxFriendsPage}
								onNav={onFriendsPageNav} />
							{friendRows}
							{friends.length == 0 &&
								"No friends yet"
							}
							<PageNav
								page={friendsPage}
								maxPage={maxFriendsPage}
								onNav={onFriendsPageNav} />
						</div>
					</div>
					<div className="box-panel created-setups">
						<div className="heading">
							Setups Created
						</div>
						<div className="content">
							{createdSetupRows}
							{createdSetups.length == 0 &&
								"No setups"
							}
						</div>
					</div>
				</div>
			</div>
			<Comments location={userId} />
		</>
	);
}