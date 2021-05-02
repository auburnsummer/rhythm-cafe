import { useState, useEffect } from 'preact/hooks';
import axios from 'redaxios';

import { LoadingState, API_URL } from "../utils/constants";
import { groupBy, uniqBy } from "../utils/helpers";
import { Level, sourceId } from "../utils/types";

type DatasetteResponseItem = {
    id: string,
    artist: string,
    song: string,
    difficulty: number,
    seizure_warning: number,
    description: string,
    max_bpm: number,
    min_bpm: number,
    last_updated: string,
    single_player: number,
    two_player: number,
    thumb: string,
    url: string | null,
    url2: string,
    icon: string | null,
    hue: number,
    has_classics: number,
    has_oneshots: number,
    has_squareshots: number,
    has_swing: number,
    has_freetimes: number,
    has_holds: number,
    source_id: sourceId,
    source_iid: string,
    uploaded: number,
    approval: number,
    approval_message: string | null,
    rn: number,
    tag: string,
    tag_seq: number,
    author: string,
    author_seq: number
}

type DatasetteResponse = Array<DatasetteResponseItem>

export function useDatasette(query: string): [
    Level[],
    string | false,
    LoadingState
] {
    const [result, setResult] = useState<Array<Level>>([]);
    const [error, setError] = useState<false | string>(false);
    const [state, setState] = useState(LoadingState.Loading);

    useEffect(() => {
        console.log("New SQL query!!!");
        console.log(query);
        setState(LoadingState.Loading);
        axios<DatasetteResponse>({
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
                const groups = groupBy(x => x.id, data);
                return Object.entries(groups).map(([, rows]) => {
                    const tags = rows[0].tag == null
                        ? []
                        : uniqBy(x => x.tag_seq, rows)
                            .sort((a, b) => a.tag_seq - b.tag_seq)
                            .map(x => x.tag);
                    const authors = uniqBy(x => x.author_seq, rows)
                        .sort((a, b) => a.author_seq - b.author_seq)
                        .map(x => x.author);
                    return {
                        ...rows[0],
                        tags,
                        authors,
                    };
                });
            })
            .then(processed =>
                // turn some of the 1 or 0 values into booleans.
                processed.map(level => ({
                    ...level,
                    seizure_warning: level.seizure_warning === 1,
                    has_classics: level.has_classics === 1,
                    has_holds: level.has_holds === 1,
                    has_oneshots: level.has_oneshots === 1,
                    has_squareshots: level.has_squareshots === 1,
                    has_swing: level.has_swing === 1,
                    has_freetimes: level.has_freetimes === 1,
                    single_player: level.single_player === 1,
                    two_player: level.two_player === 1,
                })))
            .then(processed => {
                setResult(processed);
                setState(LoadingState.Loaded);
            })
            .catch(err => {
                console.log('here is an error!');
                console.log(err);
                setState(LoadingState.Error);
                setError(err);
            });
    }, [query]);

    return [result, error, state];
}
