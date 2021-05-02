import { h, Fragment } from 'preact';
import "./LevelBox.css";
import cc from "classcat";

import { Level } from "../utils/types";

function authorText({authors}: Pick<Level, "authors">) {
    // @ts-ignore
    const formatter = new Intl.ListFormat('en', { style: 'short', type: 'conjunction' });
    return formatter.format(authors);
}

function bpmText({max_bpm, min_bpm}: Partial<Level>) {
    return max_bpm === min_bpm
        ? `${max_bpm} BPM`
        : `${min_bpm}-${max_bpm} BPM`;
}

function SourceIcon({source_id}: Pick<Level, "source_id">) {
    const map = {
        yeoldesheet: <i class="lb_metaicon fab fa-discord" />,
        rdl: <i class="lb_metaicon fab fa-discord" />,
        workshop: <i class="lb_metaicon fab fa-steam" />,
    };
    return map[source_id];
}

function sourceText({source_id}: Pick<Level, "source_id">) {
    const map = {
        yeoldesheet: 'Rhythm Doctor Lounge',
        rdl: 'Rhythm Doctor Lounge',
        workshop: 'Steam Workshop',
    };
    return map[source_id];
}

function ApprovalIcon({approval}: Pick<Level, "approval">) {
    const approvedDescriptions = [
        "Peer-Reviewed: A trusted member of the community has checked for correct timing, metadata, and cues.",
        "Non-Referred: A trusted member of the community has checked for correct timing, metadata, and cues, and has found that the level does not meet standards.",
        "Not Yet Reviewed: This level has not yet been checked for correct timing, metadata, and cues.",
    ];
    if (approval >= 10) {
        return <i class="fas fa-check" title={approvedDescriptions[0]} />;
    }
    if (approval < 0) {
        return <i class="fas fa-times" title={approvedDescriptions[1]} />;
    }

    return <i class="fad fa-dot-circle" title={approvedDescriptions[2]} />;
}

function Tags({seizure_warning, tags}: Pick<Level, "seizure_warning" | "tags">) {
    return (
        <ul class="lb_tags">
            {seizure_warning
                ? <li class="caution!lb_tag lb_tag">
                    <i class="fad fa-exclamation-triangle" />
                    <span>Seizure warning</span>
                </li>
                : null}
            {
                tags.map(tag => (
                    <li class="lb_tag">{tag}</li>
                ))
            }
        </ul>
    )
}

function DescriptionText({description}: Pick<Level, "description">) {
    // match either an opening color tag or an ending color tag.
    // rhythm doctor doesn't require ending color tags, so you can't rely on
    // there always being a matching end tag.
    const re = /<color=#[0-9a-fA-F]+?>|<\/color>/g;

    const colorFiltered = description.replaceAll(re, "");

    return <>{colorFiltered.split("\n").map(p => <p>{p}</p>)}</>
}

export function LevelBox({level}: {level: Level}) {
    const {
        thumb, artist, song, approval, description,
    } = level;

    return (
        <article class="lb">
            <div class="lb_imagebox">
                <img class="lb_image" src={thumb} />
                <div class="lb_overlay">
                    <div class="lb_description">
                        <DescriptionText {...level} />
                    </div>
                </div>
            </div>
            <div class="lb_info">
                {/* <DifficultyDecorator {...level} /> */}
                <div class="lb_cast">
                    <h2 class="lb_artist">{artist}</h2>
                    <h1 class="lb_song">{song}</h1>
                    <div class="lb_metadatawrapper">
                        <ul class="lb_metadata">
                            <li class="lb_metaitem lb_author">
                                <i class="lb_metaicon fad fa-pencil-alt" />
                                <span class="lb_metatext">{authorText(level)}</span>
                            </li>
                            <li class="lb_metaitem lb_bpm">
                                <i class="lb_metaicon fad fa-heartbeat fa-swap-opacity" />
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
                                    "yay!lb_approved": approval >= 10,
                                    "nay!lb_approved": approval < 0,
                                    "umm!lb_approved": approval === 0,
                                }])
                            }>
                                <ApprovalIcon approval={approval} />
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="lb_spacer" />
                <Tags {...level} />
            </div>
        </article>
    )
}
