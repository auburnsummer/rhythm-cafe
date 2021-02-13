import { useState, useEffect } from 'https://cdn.skypack.dev/preact/hooks';
import { fromPairs, zip, map, pipe, groupBy, prop, uniq, uniqBy, sortBy, filter, omit } from 'https://cdn.skypack.dev/ramda';

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
            if (data.results.length === 0) {
                return [];
            }
            // turn a row into an object with named keys.
            const normalise = map(
                pipe(
                    zip(data.results[0].columns),
                    fromPairs
                )
            );
            const normalised = normalise(data.results[0].values);

            // if a level has multiple tags / authors, it shows up as multiple rows. group them:
            const groups = groupBy(prop("id"), normalised);

            const uniqueIds = uniq(map(prop("id"), normalised));

            // for each id...
            const result = map(
                id => {
                    const group = groups[id];
                    const tags = pipe(
                        filter(prop("tag_seq")),
                        uniqBy(prop("tag_seq")),
                        sortBy(prop("tag_seq")),
                        map(prop("tag"))
                    )(group);
                    const authors = pipe(
                        filter(prop("author_seq")),
                        uniqBy(prop("author_seq")),
                        sortBy(prop("author_seq")),
                        map(prop("author"))
                    )(group);

                    return {
                        ...omit(["tag", "tag_seq", "author", "author_seq"], group[0]),
                        tags,
                        authors
                    }
                }
            , uniqueIds)
            return result;
        })
        .then(processed => {
            setResult(processed);
            setState(LoadingState.Loaded);
        })
        .catch(err => {
            console.log("here is an error!");
            console.log(err);
        })
    }, [query]);

    return [result, state];

}
