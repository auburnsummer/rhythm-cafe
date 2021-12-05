import { API_URL } from "../utils/constants";
import { useCallback, useEffect, useState } from "preact/hooks";
import { useMitt } from "./useMitt";
import axios from "redaxios";

/**
 * @typedef Level
 * @property {string} id
 * @property {string} artist
 * @property {string} song
 * @property {0 | 1 | 2 | 3} difficulty
 * @property {0 | 1} seizure_warning
 * @property {string} description
 * @property {number} max_bpm
 * @property {number} min_bpm
 * @property {number} last_updated
 * @property {0 | 1} single_player
 * @property {0 | 1} two_player
 * @property {string[]} authors
 * @property {string[]} tags
 * @property {string} thumb
 * @property {string?} url
 * @property {string} url2
 * @property {string?} icon
 * @property {number} hue
 * @property {0 | 1} has_classics
 * @property {0 | 1} has_oneshots
 * @property {0 | 1} has_squareshots
 * @property {0 | 1} has_swing
 * @property {0 | 1} has_freetimes
 * @property {0 | 1} has_holds
 * @property {string} source_id
 * @property {string} source_iid
 * @property {number} uploaded
 * @property {number} approval
 * @property {number} kudos
 */

/**
 * @typedef {string} LevelProps
 */

/** @type import("../utils/constants").LoadingState */
const initialState = 'Loading';

/** @type {{levels: Level[], next: string}} */
const initialValue = {levels: [], next: ""}


/** @param {import("../parts/SearchContext/SearchContext").SearchContext} input */
export function useLevels(input) {
    const [state, setState] = useState(initialState);
    const [result, setResult] = useState(initialValue);
    const [error, setError] = useState(null);

    const E = useMitt();

    const update = useCallback(() => {
        setState('Loading');

        // first item is the key, second is the value.
        // https://docs.datasette.io/en/stable/json_api.html
        // also just playing with the GUI at api.rhythm.cafe can help understand the parameters

        // params from search context.
        const searchParams = input.params.map(sp => {
            return sp.type == undefined
                ? [sp.param, sp.value]
                : [`${sp.param}__${sp.type}`, sp.value]
        });

        // also params from search context.
        const otherSearchParam = input.q !== ""
             ? [["_search", input.q]]
             : [];

        // params that are always there.
        const fixedParams = [
            ["_json", "tags"],
            ["_json", "authors"],
            ["_ttl", "3600"], // 1 hour
            ["_size", "25"]
        ];

        const params = [...searchParams, ...fixedParams, ...otherSearchParam];

        // build a URLSearchParams object out of it.
        // we're doing it like this because of the multiple "_json" arguments, so
        // a standard object won't work.
        const URLParams = params.reduce((prev, [key, value]) => {
            prev.append(key, value);
            return prev;
        }, new URLSearchParams());

        axios({
            method: 'GET',
            url: API_URL,
            params: URLParams
        })
            .then(resp => {
                // convert seperate column/row lists to objects. we can't use _shape param for now because we need next_url...
                // ...and Datasette's current CORS configuration prevents us from getting it otherwise.
                // TODO: submit PR to Datasette adding "link" to CORS properties
                const columns = resp.data.columns;
                const rows = resp.data.rows;
                const levels = rows
                    .map(row => {
                        // 1-liner from hell...
                        return [...columns.keys()].reduce((prev, n) => ({...prev, [columns[n]] : row[n]}), {})
                    });
                const next = new URLSearchParams(new URL(resp.data.next_url).search).get("_next");
                setResult({levels, next});
                setState("Loaded");
            })
            .catch(err => {
                setState('Error');
                setError(err);
            })

    }, [input.params, input.q]);

    useEffect(() => {
        E.on("startNewSearch", update);
        return () => {
            E.off("startNewSearch")
        }
    }, [E, update]);

    // fire one off, initially.
    useEffect(() => {
        E.emit("startNewSearch");
    }, [E]);

    return {state, result, error};
}