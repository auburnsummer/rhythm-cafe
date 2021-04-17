import { useState, useEffect } from 'preact/hooks';
import axios from 'redaxios';
import {
    LoadingState, API_URL, groupBy, uniqBy,
} from '../utils';

export function useDatasette(query) {
    const [result, setResult] = useState([]);
    const [error, setError] = useState(false);
    const [state, setState] = useState(LoadingState.Loading);

    useEffect(() => {
        setState(LoadingState.Loading);
        axios({
            method: 'GET',
            url: API_URL,
            params: {
                _shape: 'array',
                sql: query,
            },
        })
            .then(({ data }) => {
                // processing to get it in a better 'shape'.
                // todo: would be nicer from an API standpoint to do this in datasette?
                // then people can make downloaders, etc. without having to do this
                const groups = groupBy((x) => x.id, data);
                return Object.entries(groups).map(([, rows]) => {
                    const tags = rows[0].tag == null
                        ? []
                        : uniqBy((x) => x.tag_seq, rows)
                            .sort((a, b) => a.tag_seq - b.tag_seq)
                            .map((x) => x.tag);
                    const authors = uniqBy((x) => x.author_seq, rows)
                        .sort((a, b) => a.author_seq - b.author_seq)
                        .map((x) => x.author);
                    return {
                        ...rows[0],
                        tags,
                        authors,
                    };
                });
            })
            .then((processed) => {
                setResult(processed);
                setState(LoadingState.Loaded);
            })
            .catch((err) => {
                console.log('here is an error!');
                console.log(err);
                setState(LoadingState.Error);
                setError(err);
            });
    }, [query]);

    return [result, error, state];
}
