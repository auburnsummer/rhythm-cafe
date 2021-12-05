import { useMemo, useReducer, useState } from "preact/hooks";
import { SearchContext } from "./SearchContext";
import { nanoid } from 'nanoid';

/**
 * @typedef SearchContextFactoryProps
 * @property {JSX.Element} children
 */

/** @type import('./SearchContext').SearchContext */
const initialState = {
    params: [
        {
            id: nanoid(),
            type: "exact",
            param: "difficulty",
            value: 2
        }
    ],
    q: "rdrpg"
}

/**
 * @param {SearchContext} prev 
 * @param {*} action 
 */
function reducer(prev, action) {
    return prev;
}

/** @param {SearchContextFactoryProps} */
export function SearchContextFactory({children}) {

    
    // const [state, setState] = useState(initialState);
    const [state, dispatch] = useReducer(reducer, initialState);

    const value = useMemo(() => [state, dispatch], [state]);

    return (
        <SearchContext.Provider value={value}>
            {children}
        </SearchContext.Provider>
    )
}