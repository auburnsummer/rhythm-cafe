import { Level, SearchParams, SearchResponse } from "@orchard/types";
import { TYPESENSE_API_KEY, TYPESENSE_URL } from "@orchard/utils/constants";
import Axios, { Response } from "redaxios";
import useSWR from "swr";
import usePrevious from "./usePrevious";

// const fetcher: Fetcher<Response<SearchResponse<Level>>, SearchParams> = params => {
//     return Axios({
//         url: `${TYPESENSE_URL}/collections/levels/documents/search`,
//         headers: {
//             'x-typesense-api-key': TYPESENSE_API_KEY
//         },
//         params: params
//     });
// }

export function useLevels(params: SearchParams) {    
    const processed: SearchParams = {
        ...params,
        q: params.q.trim()
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