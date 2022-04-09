import { memo } from 'preact/compat';

import { WithClass } from "@orchard/types";
import { useLevels } from "@orchard/hooks/useLevels";
import cc from "clsx";


import "./Levels.css";
import { LevelBox } from "@orchard/components/LevelBox";
import { useStore } from "@orchard/hooks/useStore";


type LevelsProps = {} & WithClass;

const MemoLevelBox = memo(LevelBox, (prev, next) => prev.level.id === next.level.id);

export function Levels({"class": _class}: LevelsProps) {
    const q = useStore(state => state.q);
    const { data: resp, error, isLagging, resetPreviousData } = useLevels(
        {
            q: q,
            query_by: "song, authors, artist, description",
            facet_by: "authors, tags, source"
        }
    );

    return (
        <main class={cc(_class, "le")}>
            {
                error && (
                    <div>An error occured: {error.data.message}, {error.status}</div>
                )
            }
            {
                !resp && <div class="le_loading">Loading...</div>
            }
            {
                resp && (
                    <div class="le_loaded">
                        <ul class="le_list">
                            {resp.data.hits && resp.data.hits.map(({document}) => (
                                <li key={document.id}>
                                    <MemoLevelBox level={document} key={document.id} />
                                </li>
                            ))}
                        </ul>
                    </div>
                )
            }
        </main>
    )
}