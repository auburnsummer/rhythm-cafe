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
            <div>
                <img src={level.thumb} />
            </div>
            <div>
                <div>
                    <h2>{level.artist}</h2>
                    <h1>{level.song}</h1>
                </div>
            </div>
        </article>
    )
}