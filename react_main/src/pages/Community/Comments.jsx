import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import update from "immutability-helper";

import { useErrorAlert } from "../../components/Alerts";
import { VoteWidget } from "./Forums/Forums";
import { NameWithAvatar } from "../User/User";
import { Time, filterProfanity } from "../../components/Basic";
import { PageNav } from "../../components/Nav";
import { TextEditor } from "../../components/Form";
import { UserContext } from "../../Contexts";

import "../../css/forums.css";
import "../../css/comments.css";

export default function Comments(props) {
	const location = props.location;

	const [page, setPage] = useState(1);
	const [comments, setComments] = useState([]);
	const [showInput, setShowInput] = useState(false);
	const [postContent, setPostContent] = useState("");

	const user = useContext(UserContext);
	const errorAlert = useErrorAlert();

	useEffect(() => {
		onCommentsPageNav(1);
	}, []);

	function onCommentsPageNav(_page) {
		var filterArg;

		if (_page == 1)
			filterArg = "last=Infinity";
		else if (_page < page)
			filterArg = `first=${comments[0].date}`;
		else if (_page > page)
			filterArg = `last=${comments[comments.length - 1].date}`;
		else
			return;

		axios.get(`/comment?location=${location}&${filterArg}`)
			.then(res => {
				if (res.data.length > 0) {
					setComments(res.data);
					setPage(_page);
				}
				else {
					setComments(update(comments, {
						isLastPage: {
							$set: true
						}
					}));
				}
			})
			.catch(errorAlert);
	}

	function onPostSubmit() {
		axios.post("/comment", { content: postContent, location })
			.then(() => {
				onCommentsPageNav(1);
				setPostContent("");
				setShowInput(false);
			})
			.catch(errorAlert);
	}

	function onPostCancel() {
		setShowInput(false);
	}

	const commentRows = comments.map(comment => (
		<Comment
			comment={comment}
			comments={comments}
			setComments={setComments}
			onDelete={() => onCommentsPageNav(page)}
			onRestore={() => onCommentsPageNav(page)}
			key={comment.id} />
	));

	return (
		<div className="comments-wrapper thread-wrapper">
			<div className="comments-input-wrapper">
				{!showInput && user.loggedIn && user.perms.postReply &&
					<div
						className="btn btn-theme"
						onClick={() => setShowInput(true)}>
						Post Comment
					</div>
				}
				{showInput &&
					<div
						className="reply-form span-panel">
						<TextEditor
							value={postContent}
							onChange={setPostContent} />
						<div className="post-btn-wrapper">
							<div
								className="post-reply btn btn-theme"
								onClick={onPostSubmit}>
								Post
							</div>
							<div
								className="btn btn-theme-sec"
								onClick={onPostCancel}>
								Cancel
							</div>
						</div>
					</div>
				}
			</div>
			<div className="comments-page">
				<PageNav
					page={page}
					onNav={onCommentsPageNav} />
				{comments.length == 0 &&
					"No comments yet"
				}
				{commentRows}
				<PageNav
					page={page}
					onNav={onCommentsPageNav} />
			</div>
		</div>
	);
}

function Comment(props) {
	const comment = props.comment;
	const comments = props.comments;
	const setComments = props.setComments;
	const onDelete = props.onDelete;
	const onRestore = props.onRestore;

	const user = useContext(UserContext);
	const errorAlert = useErrorAlert();

	function onDeleteClick() {
		const shouldDelete = window.confirm("Are you sure you wish to delete this?");

		if (!shouldDelete)
			return;

		axios.post(`/comment/delete`, { comment: comment.id })
			.then(onDelete)
			.catch(errorAlert);
	}

	function onRestoreClick() {
		axios.post(`/comment/restore`, { comment: comment.id })
			.then(onRestore)
			.catch(errorAlert);
	}

	var content = comment.content;

	if (comment.deleted && user.settings.hideDeleted)
		content = "*deleted*";

	return (
		<div className={`post span-panel ${comment.deleted ? "deleted" : ""} ${props.className}`}>
			<div className="vote-wrapper">
				<VoteWidget
					item={comment}
					itemHolder={comments}
					setItemHolder={setComments}
					itemType="comment" />
			</div>
			<div className="main-wrapper">
				<div className="heading">
					<div className="heading-left">
						<div className="post-info">
							<NameWithAvatar
								id={comment.author.id}
								name={comment.author.name}
								avatar={comment.author.avatar} />
							<div className="post-date">
								<Time
									minSec
									millisec={Date.now() - comment.date} />
								{" ago"}
							</div>
						</div>
					</div>
					<div className="btns-wrapper">
						{!comment.deleted && (user.perms.deleteAnyPost || (user.perms.deleteOwnPost && comment.author.id == user.id)) &&
							<i
								className="fas fa-trash"
								onClick={onDeleteClick} />
						}
						{comment.deleted && user.perms.restoreDeleted &&
							<i
								className="fas fa-trash-restore"
								onClick={onRestoreClick} />
						}
					</div>
				</div>
				<div className="md-content">
					<ReactMarkdown source={content} />
				</div>
			</div>
		</div>
	);
}