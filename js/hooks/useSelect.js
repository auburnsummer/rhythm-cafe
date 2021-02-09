import { useState, useEffect } from 'https://cdn.skypack.dev/preact/hooks';
import { fromPairs, zip, map, pipe } from 'https://cdn.skypack.dev/ramda';

import { LoadingState } from "../utils/enums.js";

export function useSelect(worker, query) {
    const [result, setResult] = useState([]);
    const [state, setState] = useState(LoadingState.Loading);

    useEffect(() => {
        setState(LoadingState.Loading);
        worker.send({
            action: 'exec',
            sql: query
        })
        .then(data => {
            const normalise = map(
                pipe(
                    zip(data.results[0].columns),
                    fromPairs
                )
            );
            const normalised = normalise(data.results[0].values);
            setResult(normalised);
            setState(LoadingState.Loaded);
        })
        .catch(err => {
            console.log("here is an error!");
            console.log(err);
        })
    }, [query]);

    return [result, state];

}
