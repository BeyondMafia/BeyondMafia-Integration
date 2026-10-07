// Adapted 2026-10-05 from quantbitrealmSimon / BeyondMafia PR956.
// Correct placeholder capture/index handling; CC BY-NC-SA 4.0, see LICENSE.
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";

/**
 * EnhancedMarkdown Component
 * Extends ReactMarkdown with custom features:
 * - Spoiler tags: ||spoiler text||
 * - YouTube embeds: youtube:VIDEO_ID or https://youtube.com/watch?v=VIDEO_ID
 * - SoundCloud embeds: soundcloud:TRACK_URL
 */
export default function EnhancedMarkdown({ source, ...props }) {
	const [revealedSpoilers, setRevealedSpoilers] = useState(new Set());

	const toggleSpoiler = (index) => {
		setRevealedSpoilers((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(index)) {
				newSet.delete(index);
			} else {
				newSet.add(index);
			}
			return newSet;
		});
	};

	// Process the source content
	const processContent = (text) => {
		if (!text) return text;

		let processed = text;

		// Replace spoiler syntax ||text|| with placeholder
		const spoilers = [];
		processed = processed.replace(/\|\|(.+?)\|\|/g, (match, content) => {
			spoilers.push(content);
			return `[[SPOILER_${spoilers.length - 1}]]`;
		});

		// Replace YouTube URLs with embed placeholders
		const youtubeVideos = [];
		processed = processed.replace(
			/(?:youtube:|https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/))([a-zA-Z0-9_-]{11})/g,
			(match, videoId) => {
				youtubeVideos.push(videoId);
				return `[[YOUTUBE_${youtubeVideos.length - 1}]]`;
			}
		);

		// Replace SoundCloud URLs with embed placeholders
		const soundcloudTracks = [];
		processed = processed.replace(
			/soundcloud:(https?:\/\/soundcloud\.com\/[\w-]+\/[\w-]+)/g,
			(match, trackUrl) => {
				soundcloudTracks.push(trackUrl);
				return `[[SOUNDCLOUD_${soundcloudTracks.length - 1}]]`;
			}
		);

		return { processed, spoilers, youtubeVideos, soundcloudTracks };
	};

	const { processed, spoilers, youtubeVideos, soundcloudTracks } = processContent(source);

	// Custom renderer for text to handle spoilers
	const renderers = {
		text: ({ value }) => {
			if (!value) return null;

			// Split by placeholders and render accordingly
			const parts = value.split(/(\[\[(?:SPOILER|YOUTUBE|SOUNDCLOUD)_\d+\]\])/);

			return parts.map((part, i) => {
				const placeholder = part.match(/^\[\[(SPOILER|YOUTUBE|SOUNDCLOUD)_(\d+)\]\]$/);
				const index = placeholder ? parseInt(placeholder[2], 10) : -1;
				if (placeholder && placeholder[1] === "SPOILER" && index < spoilers.length) {
					const isRevealed = revealedSpoilers.has(`${index}-${i}`);
					return (
						<span
							key={`spoiler-${i}`}
							className={`spoiler-tag ${isRevealed ? "revealed" : ""}`}
							onClick={() => toggleSpoiler(`${index}-${i}`)}>
							{isRevealed ? spoilers[index] : "Spoiler (click to reveal)"}
						</span>
					);
				}
				if (placeholder && placeholder[1] === "YOUTUBE" && index < youtubeVideos.length) {
					const videoId = youtubeVideos[index];
					return (
						<div key={`youtube-${i}`} className="embed-container youtube-embed">
							<iframe
								width="560"
								height="315"
								src={`https://www.youtube.com/embed/${videoId}`}
								title="YouTube video player"
								frameBorder="0"
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
								allowFullScreen
							/>
						</div>
					);
				}
				if (placeholder && placeholder[1] === "SOUNDCLOUD" && index < soundcloudTracks.length) {
					const trackUrl = soundcloudTracks[index];
					return (
						<div key={`soundcloud-${i}`} className="embed-container soundcloud-embed">
							<iframe
								width="100%"
								height="166"
								scrolling="no"
								frameBorder="no"
								allow="autoplay"
								src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(trackUrl)}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true`}
							/>
						</div>
					);
				}
				// Skip empty strings
				if (!part) return null;
				return <span key={`text-${i}`}>{part}</span>;
			});
		},
	};

	return (
		<div className="enhanced-markdown">
			<ReactMarkdown {...props} source={processed} renderers={renderers} />
		</div>
	);
}
