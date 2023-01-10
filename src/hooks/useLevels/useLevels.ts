import type { Level, SearchParams, SearchResponse } from '@orchard/hooks/useLevels/types';
import { useLevelsSearchParams } from '@orchard/store/levelsSearchParams';
import { TYPESENSE_API_KEY, TYPESENSE_URL } from '@orchard/utils/constants';
import type { Response } from 'redaxios';
import Axios from 'redaxios';
import useSWR from 'swr';

type useLevelsProps = {
    facetQuery?: string;
    maxFacetValues?: number;
}

function fetcher(params: SearchParams) {
    return Axios<SearchResponse<Level>>({
        url: `${TYPESENSE_URL}/collections/levels/documents/search`,
        headers: {
            'x-typesense-api-key': TYPESENSE_API_KEY
        },
        params
    });
}

type SWRReturnType = Response<SearchResponse<Level>>;
type SWRErrorType = Response<unknown>;

export function useLevels({ facetQuery, maxFacetValues }: useLevelsProps = {}) {
    const processed = useLevelsSearchParams();
    processed.max_facet_values = maxFacetValues ?? 10;
    if (facetQuery) {
        processed.facet_query = facetQuery;
    }

    const { data, error, isLoading } = useSWR<SWRReturnType, SWRErrorType>(processed, fetcher, {
        keepPreviousData: true
    });
 
    return { data, error, isLoading };
}