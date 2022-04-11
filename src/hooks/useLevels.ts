import { Level, SearchParams, SearchResponse } from "@orchard/types";
import { TYPESENSE_API_KEY, TYPESENSE_URL } from "@orchard/utils/constants";
import Axios, { Response } from "redaxios";
import useSWR from "swr";
import usePrevious from "@orchard/hooks/usePrevious";
import { useStore } from "@orchard/hooks/useStore";
import { getKeys } from "@orchard/utils/grabbag";

function useFilterByString() {
    const filters = useStore(state => state.filters);
    return getKeys(filters)
        .map(key => {
            const filter = filters[key];
            if (!filter) {
                return null;
            } 
            if (filter.type === 'in' && filter.values.size > 0) {
                return `${key}:=[${Array.from(filter.values).join(',')}]`;
            }
        })
        .filter((s): s is string => typeof s === 'string')
        .join(" && ");
}

type useLevelsProps = {
    facetQuery?: string;
    maxFacetValues?: number;
}

export function useLevels({facetQuery, maxFacetValues}: useLevelsProps = {}) {
    const q = useStore(state => state.q);
    const facetBy = useStore(state => state.facetBy);
    const filterByString = useFilterByString();
    // const filters = useStore(state => state.filters);

    const processed: SearchParams = {
        q: q.trim(),
        query_by: "song, authors, artist, description",
        facet_by: facetBy.join(","),
        max_facet_values: maxFacetValues || 10,
        filter_by: filterByString,
    };
    if (facetQuery) {
        processed.facet_query = facetQuery;
    }


    const {data, error} = useSWR<Response<SearchResponse<Level>>, Response<any>>(processed, (params: SearchParams) => {
        return Axios({
            url: `${TYPESENSE_URL}/collections/levels/documents/search`,
            headers: {
                'x-typesense-api-key': TYPESENSE_API_KEY
            },
            params
        })
    });

    const [previousData, resetPreviousData] = usePrevious(data);
    const dataOrPrevious = data === undefined ? previousData : data;
    const isLagging = data === undefined && previousData !== undefined


    return { data: dataOrPrevious, error, isLagging, resetPreviousData}
}