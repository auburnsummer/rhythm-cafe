import { h, Fragment } from 'preact';
import "./LevelBox.css";
import cc from "classcat";

import { Level } from "../utils/types";
import { LanguageContext } from "../hooks/LanguageContext";
import { useContext } from 'preact/hooks';

import copy from 'clipboard-copy';

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

function sourceText(source_id: string, text: (id: string) => string) {
    return text(`source_${source_id}`);
}

type TextFuncObj = {text: (id: string) => string};
type ApprovalIcon = Pick<Level, "approval"> & TextFuncObj;
function ApprovalIcon({approval, text}: ApprovalIcon) {
    if (approval >= 10) {
        return <i class="fas fa-check" title={text('peerreview_okay')} />;
    }
    if (approval < 0) {
        return <i class="fas fa-times" title={text('peerreview_fail')} />;
    }

    return null;
}

type Tags = Pick<Level, "seizure_warning" | "tags"> & TextFuncObj;
function Tags({seizure_warning, tags, text}: Tags) {
    return (
        <ul class="lb_tags">
            {seizure_warning
                ? <li class="caution!lb_tag lb_tag">
                    <i class="fad fa-exclamation-triangle" />
                    <span title="fhaifhaihf">{text('seizure_warning')}</span>
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

    // TODO: instead of stripping out the color tags, actually use them
    const re = /<color=#[0-9a-fA-F]+?>|<\/color>/g;

    const colorFiltered = description.replaceAll(re, "");

    return <>{colorFiltered.split("\n").map(p => <p>{p}</p>)}</>
}

type DifficultyDecorator = Pick<Level, "difficulty"> & TextFuncObj;
function DifficultyDecorator({difficulty, text}: DifficultyDecorator) {

    return (
        <div class={cc(
            ["lb_dd",
            {
                "easy!lb_dd" : difficulty === 0,
                "medium!lb_dd" : difficulty === 1,
                "tough!lb_dd" : difficulty === 2,
                "souls!lb_dd" : difficulty === 3
            }])}>
            <span class="lb_ddbg"></span>
            <span class="lb_ddtext">{text(`difficulty_${difficulty}`)}</span>
        </div>
    )
}

export function LevelBox({level}: {level: Level}) {
    const {
        thumb, artist, song, approval,
    } = level;

    const { lang, text } = useContext(LanguageContext);

    const canonicalUrl = level.url ? level.url : level.url2;

    return (
        <article class="lb">
            <div class="lb_imagebox">
                <img class="lb_image" src={thumb} />
                <div class="lb_overlay">
                    <div class="lb_description">
                        <DescriptionText {...level} />
                    </div>
                    <div class="lb_buttons">
                        <button onClick={() => copy(canonicalUrl)} class="lb_button lb_copy">
                            <i class="fas fa-copy"></i>
                        </button>
                        <a href={canonicalUrl} class="lb_button lb_download">
                            <i class="fas fa-download"></i>
                        </a>
                    </div>
                </div>
            </div>
            <div class="lb_info">
                <DifficultyDecorator {...level} text={text} />
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
                                <span class="lb_metatext">{sourceText(level.source_id, text)}</span>
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
                                <ApprovalIcon approval={approval} text={text} />
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="lb_spacer" />
                <Tags {...level} text={text} />
            </div>
        </article>
    )
}
