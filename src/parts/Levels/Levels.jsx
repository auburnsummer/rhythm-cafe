import { LevelBox } from "..";
import { useLevels } from "../../hooks/useLevels"
import cc from "clsx";

import "./Levels.css";

/**
 * @typedef LevelsProps
 * @property {string} class 
 */

/** @param {LevelsProps} */
export function Levels({"class": _class}) {

    const {state, result, error} = useLevels();

    return (
        <main class={cc(_class, "le")}>
            <ul class="le_list">
                {
                    result.levels.map(level => (
                        <li class="le_item">
                            <LevelBox class="le_levelbox" level={level} />
                        </li>
                    ))
                }
            </ul>
        </main>
    )
}