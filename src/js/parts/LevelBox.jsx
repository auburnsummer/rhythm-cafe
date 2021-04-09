import { h } from 'preact';

import "./LevelBox.css";

export function LevelBox({level}) {
	const approved = level.approval >= 10;

	const approvedDescriptions = [
		"Peer-Reviewed: A trusted member of the community has checked for correct timing, metadata, and cues.",
		"Non-Referred: A trusted member of the community has checked for correct timing, metadata, and cues, and has found that the level does not meet standards."
	]

    return (
        <article class="lb">
            <div class="lb_imagebox">
                <img class="lb_image" src={level.thumb} />
            </div>
            <div class="lb_info">
                <div>
                    <h2 class="lb_artist">{level.artist}</h2>
                    <h1 class="lb_song">{level.song}</h1>
                </div>
            </div>
        </article>
    )
}