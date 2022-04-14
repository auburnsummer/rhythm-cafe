import { WithClass } from "@orchard/utils/types";
import { Level, SearchResponseHit, useLevels } from "@orchard/hooks/useLevels";
import cc from "clsx";


import "./Levels.css";
import { LevelBox } from "@orchard/components/LevelBox";
import { useVirtual } from "react-virtual";
import { useCallback, useMemo, useRef } from "preact/hooks";
import { useMeasure } from "react-use";
import { useForkRef } from "@orchard/hooks/useForkRef";


type LevelsProps = {} & WithClass;
type LevelsListProps = {
    hits: SearchResponseHit<Level>[];
    isLagging: boolean;
}

function LevelsList({hits, isLagging}: LevelsListProps) {

    const parentRef = useRef<HTMLDivElement>(null);
    const [ref, {width}] = useMeasure<HTMLDivElement>();

    // @ts-ignore
    const whatIsEvenHappeningNowRef = useForkRef<HTMLDivElement>(parentRef, ref);

    // now we have the width, we can calculate how many columns to put in...
    const columns = useMemo(() => {
        if (width === 0) {
            return 1;
        }
                                          // blaze it
        return Math.max(Math.ceil(width / 420), 1);
    }, [width]);


    const estimateSize = useCallback(() => {
        return 365; // by experiment
    }, []);

    const {
        virtualItems,
        totalSize
      } = useVirtual({
        size: Math.ceil(hits.length / columns),
        parentRef,
        estimateSize
    });


    return (
        <div
            class={cc("le_loaded", {"laggy!le_loaded": isLagging})}
            ref={whatIsEvenHappeningNowRef}
            style={{
                height: '100%',
                width: '100%',
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
                {
                    virtualItems.map(virtualRow => (
                        <li
                            key={virtualRow.index}
                            ref={virtualRow.measureRef}
                            class="le_vrow"
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                transform: `translateY(${virtualRow.start}px)`,
                            }}
                        >
                            <div class="le_row">
                                {
                                    hits.slice(
                                        virtualRow.index * columns,
                                        virtualRow.index * columns + columns
                                    ).map(hit => (
                                        <LevelBox level={hit.document} class="le_levelbox" />
                                    ))
                                }
                            </div>
                            
                        </li>
                    ))

                }
            </ul>
        </div>
    )
}

export function Levels({"class": _class}: LevelsProps) {
    const { data: resp, error, isLagging, resetPreviousData } = useLevels();

    return (
        <main class={cc(_class, "le")}>
            {
                error && (
                    <div>An error occured: {error.data.message}, {error.status}. If you keep seeing this, please ping auburn now!!!!!</div>
                )
            }
            {
                !resp && <div class="le_loading">Loading...</div>
            }
            {
                resp && resp.data.hits && (
                    <LevelsList hits={resp.data.hits} isLagging={isLagging}/>
                )
            }
        </main>
    )
}