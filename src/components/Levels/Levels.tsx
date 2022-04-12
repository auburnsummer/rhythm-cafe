import { WithClass } from "@orchard/types";
import { useLevels } from "@orchard/hooks/useLevels";
import cc from "clsx";


import "./Levels.css";
import { LevelBox } from "@orchard/components/LevelBox";


type LevelsProps = {} & WithClass;

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
                resp && (
                    <div class={cc("le_loaded", {"laggy!le_loaded": isLagging})}>
                        <ul class="le_list">
                            {resp.data.hits && resp.data.hits.map(({document}) => (
                                <li key={document.id}>
                                    <LevelBox level={document} key={document.id} />
                                </li>
                            ))}
                        </ul>
                    </div>
                )
            }
        </main>
    )
}