import { useMemo, useReducer } from "preact/hooks";
import { SearchContext } from "./SearchContext";
import { nanoid } from 'nanoid/non-secure';

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
    q: ""
}

/**
 * @typedef SetAction
 * @property {"set"} type
 * @property {string} id
 * @property {Partial<import("..").SearchParameter>} value
 */

/**
 * @typedef RemoveAction
 * @property {"remove"} type 
 * @property {string} id
 */

/** @typedef {SetAction | RemoveAction} Action */

/**
 * @param {SearchContext} prev 
 * @param {Action} action 
 */
function reducer({params, q}, action) {

    /**
     * @param {import("..").SearchParameter[]} params 
     * @param {Action} action
     */
    function paramReducer(params, action) {
        if (action.type === 'set') {
            return params.map(p => {
                if (p.id != action.id) {
                    return p;
                }
                return {
                    ...p,
                    ...action.value
                }
            });
        }
        if (action.type === 'remove') {
            return params.filter(({id}) => id !== action.id);
        }
    }

    /**
     * @param {string} q 
     * @param {Action} action
     */
    function qReducer(q, action) {
        return q;
    }

    return {
        params: paramReducer(params, action),
        q: qReducer(q, action)
    }
}

/** @param {SearchContextFactoryProps} */
export function SearchContextFactory({children}) {
    const [state, dispatch] = useReducer(reducer, initialState);

    const value = useMemo(() => [state, dispatch], [state]);

    return (
        <SearchContext.Provider value={value}>
            {children}
        </SearchContext.Provider>
    )
}