import { LevelBox } from "..";
import { useLevels } from "../../hooks/useLevels"
import { useMitt } from '../../hooks/useMitt';
import cc from "clsx";

import { SearchContext } from "..";

import "./Levels.css";
import { useContext, useEffect } from "preact/hooks";

/**
 * @typedef LevelsProps
 * @property {string} class 
 */

/** @param {LevelsProps} */
export function Levels({"class": _class}) {
    const [value, setValue] = useContext(SearchContext);

    const {state, result, error} = useLevels(value);

    const E = useMitt();
    
    useEffect(() => {
        E.on("yo", () => console.log("yoyoyo"));
        return () => {
            E.off("yo");
        }
    });

    useEffect(() => {
        console.log(value);
    }, [value])

    return (
        <main class={cc(_class, "le")}>
            {
                state === "Loading" && (
                    <div class="le_loading">
                        loading...
                    </div>
                )
            }
            {
                state === "Loaded" && (
                    <ul class="le_list">
                        {
                            result.levels.map(level => (
                                <li class="le_item">
                                    <LevelBox class="le_levelbox" level={level} />
                                </li>
                            ))
                        }
                    </ul>
                )
            }
        </main>
    )
}