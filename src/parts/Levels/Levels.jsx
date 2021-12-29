import { LevelBox } from "..";
import { useLevels } from "../../hooks/useLevels"
import { useMitt } from '../../hooks/useMitt';
import cc from "clsx";

import { SearchContext } from "..";

import "./Levels.css";
import { useState, useContext, useEffect, useCallback } from "preact/hooks";


/**
 * @typedef LevelsProps
 * @property {string} class 
 */

/** @param {LevelsProps} */
export function Levels({"class": _class}) {
    const [next, setNext] = useState("");

    const [value, setValue] = useContext(SearchContext);

    const {state, result, error} = useLevels(value, next);

    const E = useMitt();

    useEffect(() => {
        console.log(value);
    }, [value]);

    useEffect(() => {
        if (next) {
            E.emit("startNewSearch");
        }
    }, [next]);

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
                        {
                            result.next && (
                                <li class="le_item">
                                    <button
                                        class="le_next"
                                        onClick={() => {
                                            setNext(result.next);
                                        }}
                                    >
                                        Next page
                                    </button>
                                </li>
                            )
                        }
                    </ul>
                )
            }
        </main>
    )
}