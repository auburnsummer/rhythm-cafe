import { h } from 'preact';
import "./LevelBox.css";
import cc from "classcat";

function bpmText({max_bpm, min_bpm}) {
    return max_bpm === min_bpm ? 
           `${max_bpm} BPM` : 
           `${min_bpm}-${max_bpm} BPM`;
}

function SourceIcon({source_id}) {
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

function ApprovalIcon({approval}) {
	const approvedDescriptions = [
		"Peer-Reviewed: A trusted member of the community has checked for correct timing, metadata, and cues.",
		"Non-Referred: A trusted member of the community has checked for correct timing, metadata, and cues, and has found that the level does not meet standards.",
        "Not Yet Reviewed: This level has not yet been checked for correct timing, metadata, and cues."
	];
    if (approval >= 10) {
        return <i class="fas fa-check" title={approvedDescriptions[0]}></i>;
    }
    else if (approval < 0) {
        return <i class="fas fa-times" title={approvedDescriptions[1]}></i>;
    }
    else {
        return <i class="fad fa-dot-circle" title={approvedDescriptions[2]}></i>;
    };
}

function Tags({seizure_warning, tags}) {
    return (
        <ul class="lb_tags">
            {seizure_warning ?
            <li class="caution!lb_tag lb_tag">Seizure warning</li> :
            null}
            {
                tags.map(tag => (
                    <li class="lb_tag">{tag}</li>
                ))
            }
        </ul>
    )
}


export function LevelBox({level}) {
    const {thumb, artist, song, author, approval} = level;

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
                                <SourceIcon {...level} />
                                <span class="lb_metatext">{sourceText(level)}</span>
                            </li>
                            <li class={cc([
                                "lb_metaitem",
                                "lb_approved",
                                {
                                    "yay!lb_approved" : approval >= 10,
                                    "nay!lb_approved" : approval < 0,
                                    "umm!lb_approved" : approval === 0
                                }])
                            }>
                                <ApprovalIcon approval={approval} />
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="lb_spacer"></div>
                <Tags {...level} />
            </div>
        </article>
    )
}