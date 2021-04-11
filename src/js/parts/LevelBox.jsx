import { h } from 'preact';

import "./LevelBox.css";

export function LevelBox({level}) {
	const approved = level.approval >= 10;

	const approvedDescriptions = [
		"Peer-Reviewed: A trusted member of the community has checked for correct timing, metadata, and cues.",
		"Non-Referred: A trusted member of the community has checked for correct timing, metadata, and cues, and has found that the level does not meet standards."
	]

    const {thumb, artist, song, author} = level;

    return (
        <article class="lb">
            <div class="lb_imagebox">
                <img class="lb_image" src={thumb} />
            </div>
            <div class="lb_info">
                <div class="lb_cast">
                    <h2 class="lb_artist">{artist}</h2>
                    <h1 class="lb_song">{song}</h1>
                    <ul class="lb_metadata">
                        <li class="lb_metaitem lb_author">
                            <i class="lb_metaicon fad fa-pencil-alt"></i>
                            <span class="lb_metatext">{author}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </article>
    )
}