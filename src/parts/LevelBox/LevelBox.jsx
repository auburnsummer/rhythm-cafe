import cc from 'clsx';
import { useMemo } from 'preact/hooks';
import { ConjunctionList } from '..';
import { DifficultyDecorator } from '../DifficultyDecorator/DifficultyDecorator';

import "./LevelBox.css";

/**
 * @typedef {import("../../hooks/useLevels").Level} Level
 */

/**
 * @param {Pick<Level, "description">} props 
 */
function DescriptionText({description}) {
    // match either an opening color tag or an ending color tag.
    // rhythm doctor doesn't require ending color tags, so you can't rely on
    // there always being a matching end tag.

    // TODO: instead of stripping out the color tags, actually use them
    const re = /<color=#[0-9a-fA-F]+?>|<\/color>/g;

    const colorFiltered = description.replaceAll(re, "");

    return <>{colorFiltered.split("\n").map(p => <p>{p}</p>)}</>
}

/**
 * @typedef LevelBoxProps
 * @property {Level} level
 * @property {string?} class
 */

const formatter = new Intl.ListFormat('en', { style: 'short', type: 'conjunction' });

/**
 * @param {LevelBoxProps}
 */
export function LevelBox({level, "class": _class}) {
    const {song, artist, authors, tags, thumb, min_bpm, max_bpm, source_id, seizure_warning} = level;

    const canonicalUrl = level.url || level.url2;

    const bpmText = min_bpm === max_bpm ? `${min_bpm} BPM` : `${min_bpm}-${max_bpm} BPM`;

    const [sourceIcon, sourceText] = useMemo(() => {
        if (source_id === 'rdl' || source_id === 'yeoldesheet') {
            return ['fab fa-discord', 'Rhythm Doctor Lounge']
        }
        if (source_id === 'workshop') {
            return ['fab fa-steam', 'Steam Workshop']
        }
        // default
        return ["fad fa-cauldron", '???']
    }, [source_id]);

    return (
        <article class={cc(_class, "lb")}>

            <div class="lb_imagebox">
                <img class="lb_image" src={thumb} />
                <div class="lb_overlay">
                    <div class="lb_description">
                        <DescriptionText {...level} />
                    </div>
                    <div class="lb_buttons">
                        <button class="lb_button lb_copy">
                            <i class="fas fa-copy"></i>
                        </button>
                        <a href={canonicalUrl} class="lb_button lb_download">
                            <i class="fas fa-download"></i>
                        </a>
                    </div>
                </div>
            </div>

            <div class="lb_info">
                <DifficultyDecorator {...level} class="lb_decorator" />
                <div class="lb_cast">
                    <h1 class="lb_song">{song}</h1>
                    <h2 class="lb_artist">{artist}</h2>
                </div>
                <div class="lb_metadata-wrapper">
                    <div class="lb_metadata">
                        <div class="lb_metaitem lb_authors">
                            <i class="lb_metaicon fad fa-pencil-alt" />
                            <ConjunctionList
                                class="lb_author-list"
                                elementRender={(v) => <button class="lb_metabutton" onClick={() => console.log(v)}>{v}</button>}
                                literalRender={(v) => <span class="lb_metatext">{v}</span>}
                            >
                                {authors}
                            </ConjunctionList>
                        </div>
                        <div class="lb_metaitem lb_bpm">
                            <i class="lb_metaicon fad fa-heartbeat fa-swap-opacity" />
                            <span class="lb_metatext lb_bpm-text">{bpmText}</span>
                        </div>
                        <div class="lb_metaitem lb_source">
                            <i class={cc("lb_metaicon", sourceIcon)} />
                            <button class="lb_metabutton lb_source-button">{sourceText}</button>
                        </div>
                    </div>
                </div>
                <div class="lb_spacer">

                </div>
                <ul class="lb_tags">
                    {
                        (seizure_warning === 1) && (
                            <li>
                                <button class="caution!lb_tag lb_tag" disabled>
                                    <i class="fad fa-exclamation-triangle" />
                                    <span title="ayaya seizure warning">Seizure warning</span>
                                </button>
                            </li>
                        )
                    }
                    {
                        tags.map(tag => (
                            <li>
                                <button class="lb_tag">{tag}</button>
                            </li>
                        ))
                    }
                </ul>
            </div>
        </article>
    )
}