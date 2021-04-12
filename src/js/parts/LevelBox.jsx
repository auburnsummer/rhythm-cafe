import { h } from 'preact';

import "./LevelBox.css";

function bpmText({max_bpm, min_bpm}) {
    return max_bpm === min_bpm ? 
           `${max_bpm} BPM` : 
           `${min_bpm}-${max_bpm} BPM`;
}

function sourceIcon({source_id}) {
    const map = {
        'yeoldesheet' : <i class="lb_metaicon fab fa-discord"></i>,
        'rdl' : <i class="lb_metaicon fab fa-discord"></i>,
        'workshop' : <i class="lb_metaicon fab fa-steam"></i>
    };
    return map[source_id];
}

function sourceText({source_id}) {
    const map = {
        'yeoldesheet' : 'Rhythm Doctor Lounge',
        'rdl' : 'Rhythm Doctor Lounge',
        'workshop' : 'Steam Workshop'
    };
    return map[source_id];
}



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
                    <div class="lb_metadatawrapper">
                        <ul class="lb_metadata">
                            <li class="lb_metaitem lb_author">
                                <i class="lb_metaicon fad fa-pencil-alt"></i>
                                <span class="lb_metatext">{author}</span>
                            </li>
                            <li class="lb_metaitem lb_bpm">
                                <i class="lb_metaicon fad fa-heartbeat fa-swap-opacity"></i>
                                <span class="lb_metatext">{bpmText(level)}</span>
                            </li>
                            <li class="lb_metaitem lb_source">
                                {sourceIcon(level)}
                                <span class="lb_metatext">{sourceText(level)}</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="lb_spacer"></div>
                <ul class="lb_tags">
                    
                </ul>
            </div>
        </article>
    )
}