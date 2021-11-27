import { useMemo, useState } from "preact/hooks";
import { SearchContext } from "./SearchContext";

/**
 * @typedef SearchContextFactoryProps
 * @property {JSX.Element} children
 */

/** @param {SearchContextFactoryProps} */
export function SearchContextFactory({children}) {
    /** @type import('./SearchContext').SearchContext */
    const initialState = {
        params: [
            {
                type: "gte",
                param: "approval",
                value: 10
            }
        ],
        q: "rdrpg"
    }
    const [state, setState] = useState(initialState);

    const value = useMemo(() => [state, setState], [state]);

    return (
        <SearchContext.Provider value={value}>
            {children}
        </SearchContext.Provider>
    )
}