import { WithClass } from '@orchard/utils/types';
import { Level, SearchResponseHit, useLevels } from '@orchard/hooks/useLevels';
import cc from 'clsx';


import './Levels.css';
import { LevelBox } from '@orchard/components/LevelBox';
import { useVirtual } from 'react-virtual';
import { useCallback, useMemo, useRef } from 'preact/hooks';
import { useMeasure } from 'react-use';
import { useForkRef } from '@orchard/hooks/useForkRef';
import { usePage, usePreference } from '@orchard/store';
import { Announcements } from '@orchard/components/Announcements';


type LevelsProps = WithClass;
type LevelsListProps = {
    hits: SearchResponseHit<Level>[];
    isLagging: boolean;
}

function LevelsList({hits, isLagging}: LevelsListProps) {

    const parentRef = useRef<HTMLDivElement>(null);
    const [ref, {width}] = useMeasure<HTMLDivElement>();

    // @ts-ignore this is bc of type differences between React and Preact refs, but it works in practice
    const whatIsEvenHappeningNowRef = useForkRef<HTMLDivElement>(parentRef, ref);

    const [rowView] = usePreference('row view');

    // now we have the width, we can calculate how many columns to put in...
    const columns = useMemo(() => {
        if (rowView) {
            return 1;
        }
        if (width === 0) {
            return 1;
        }
        // blaze it
        return Math.max(Math.ceil(width / 420), 1);
    }, [width, rowView]);

    const estimateSize = useCallback(() => {
        return rowView ? 192 : 395;
    }, [hits, rowView]); // recompute the list if hits changes

    const {
        virtualItems,
        totalSize
    } = useVirtual({
        size: Math.ceil(hits.length / columns),
        parentRef,
        estimateSize
    });

    // we're trying a """table""" HTML semantics to see if we can snipe the featured snippet from indienova

    return (
        <div
            class={cc('le_loaded', {'laggy!le_loaded': isLagging})}
            ref={whatIsEvenHappeningNowRef}
            style={{
                height: '100%',
                overflow: 'auto'
            }}
        >
            <ul
                class="le_list"
                style={{
                    height: totalSize,
                    position: 'relative'
                }}
            >
                <caption class="sr-only">Rhythm Doctor Custom Levels</caption>
                <thead class="sr-only">
                    <tr>
                        <th>Song</th>
                        <th>Artist</th>
                        <th>Creator</th>
                        <th>Difficulty</th>
                        <th>Download URL</th>
                    </tr>
                </thead>
                {
                    virtualItems.map(virtualRow => (
                        <li
                            key={virtualRow.index}
                            ref={virtualRow.measureRef}
                            class="le_vrow le_row"
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                transform: `translateY(${virtualRow.start}px)`,
                            }}
                        >
                            {
                                hits.slice(
                                    virtualRow.index * columns,
                                    virtualRow.index * columns + columns
                                ).map(hit => (
                                    <LevelBox level={hit.document} class="le_levelbox" />
                                ))
                            }
                        </li>
                    ))

                }
            </ul>
        </div>
    );
}
type LevelControlsProps = WithClass;
function LevelHeader({'class': _class}: LevelControlsProps) {
    const { data: resp } = useLevels();
    const [page, setPage] = usePage();
    const [levelsPerPage] = usePreference('levels per page');
    const hasPreviousPage = page > 1;
    const hasNextPage = resp && ((page) * levelsPerPage) < resp.data.found;

    return (
        <div class={cc(_class)}>
            {hasPreviousPage && <button onClick={() => setPage(page - 1)} class="le_perv">prev</button>}
            <span class="le_page">page {page}</span>
            {hasNextPage && <button onClick={() => setPage(page + 1)} class="le_next">next</button>}
        </div>
    );
}

export function Levels({'class': _class}: LevelsProps) {
    const { data: resp, error, isLagging } = useLevels();
    const [ page ] = usePage();

    return (
        <main class={cc(_class, 'le')}>
            {
                error && error.data && (
                    <div>An error occured: {JSON.stringify(error.data)}, {error.status}. If you keep seeing this, please ping auburn now!!!!!</div>
                )
            }
            {
                !resp && <div class="le_loading">Loading...</div>
            }
            {
                resp && resp.data.hits && (
                    <>
                        {page === 1 && <Announcements class="le_announcements" />}
                        <LevelHeader class="le_controls" />
                        <LevelsList hits={resp.data.hits} isLagging={isLagging}/>
                    </>
                )
            }
        </main>
    );
}