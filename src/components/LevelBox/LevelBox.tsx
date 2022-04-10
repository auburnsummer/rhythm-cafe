import cc from 'clsx';
import copy from 'clipboard-copy';
import { useMemo } from 'preact/hooks';
import { ConjunctionList } from "@orchard/components/ConjunctionList";
import { DifficultyDecorator } from '@orchard/components/DifficultyDecorator';

import "./LevelBox.css";
import { Level, WithClass } from '@orchard/types';
import { ClipboardCopy, Download } from '@orchard/icons';


function DescriptionText({description}: Pick<Level, "description">) {
    // match either an opening color tag or an ending color tag.
    // rhythm doctor doesn't require ending color tags, so you can't rely on
    // there always being a matching end tag.

    // TODO: instead of stripping out the color tags, actually use them
    const re = /<color=#[0-9a-fA-F]+?>|<\/color>/g;

    const colorFiltered = description.replaceAll(re, "");

    return <>{colorFiltered.split("\n").map(p => <p>{p}</p>)}</>
}

type LevelBoxProps = {
    level: Level
} & WithClass;

export function LevelBox({level, "class": _class}: LevelBoxProps) {
    const {id, song, artist, authors, tags, thumb, min_bpm, max_bpm, source, seizure_warning, approval} = level;

    const canonicalUrl = level.url || level.url2;

    const bpmText = min_bpm === max_bpm ? `${min_bpm} BPM` : `${min_bpm}-${max_bpm} BPM`;

    const [sourceIcon, sourceText] = useMemo(() => {
        if (source === 'rdl' || source === 'yeoldesheet') {
            return ['fab fa-discord', 'Rhythm Doctor Lounge']
        }
        if (source === 'workshop') {
            return ['fab fa-steam', 'Steam Workshop']
        }
        // default
        return ["fad fa-cauldron", '???']
    }, [source]);

    return (
        <article class={cc(_class, "lb")}>

            <div class="lb_imagebox">
                <img class="lb_image" src={thumb} />
                <div class="lb_overlay">
                    <div class="lb_description">
                        <DescriptionText {...level} />
                    </div>
                    <div class="lb_buttons">
                        <button onClick={() => copy(canonicalUrl)} class="lb_button lb_copy">
                            <ClipboardCopy class="lb_overlayicon" />
                        </button>
                        <a href={canonicalUrl} class="lb_button lb_download">
                            <Download class="lb_overlayicon" />
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
                <div class="lb_metadata">
                    <div class="lb_metaitem lb_authors">
                        <i class="lb_metaicon fad fa-pencil-alt" />
                        <ConjunctionList
                            class="lb_author-list"
                            elementRender={(v) => 
                                <button
                                    class="lb_metabutton"
                                >
                                    {v}
                                </button>
                            }
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
                    <div
                        class={cc(
                            "lb_metaitem lb_approval",
                            { "yay!lb_approval" : approval >= 10,
                                "nope!lb_approval" : approval < 0,
                                "umm!lb_approval" : approval === 0
                            }
                        )}
                    >
                        {
                            approval >= 10 ? (
                                <i class="fas fa-check" title={"OK!"} />
                            ) : (
                                <i class="fas fa-times" title={"Nope!"} />
                            )
                        }
                    </div>
                </div>
                <div class="lb_spacer">

                </div>
                <ul class="lb_tags">
                    {
                        seizure_warning && (
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
                                <button
                                    class="lb_tag">
                                    {tag}
                                </button>
                            </li>
                        ))
                    }
                </ul>
            </div>
        </article>
    )
}