import cc from "clsx";
import { useContext } from "preact/hooks";
import { SearchToken } from "..";

import { SearchContext } from "..";

import "./Search.css";

const TOKEN_PARAMS = {
    'difficulty': function() {
        const items = {
            'exact': '=',
            'gte': '≥',
            'lte': '≤'
        }
        return {
            label: 'difficulty',
            typeDownshiftArgs: {
                items: Object.keys(items),
                itemToString: s => items[s],
                initialSelectedItem: 'exact'
            },
            valueDownshiftArgs: {
                items: [0, 1, 2, 3],
                itemToString: n => ['easy', 'medium', 'tough', 'very tough'][n],
                initialSelectedItem: 1
            }
        }
    }
    // 'difficulty': {
    //     label: 'difficulty',
    //     typeDownshiftArgs: {
    //         items: ['exact', 'gte', 'lte'],
    //         itemToString: (s) => 
    //     }
    // }
}

/**
 * @typedef SearchProps
 * @property {string?} class
 */

/** @param {SearchProps} */
export function Search({"class": _class}) {
    const [search, setSearch] = useContext(SearchContext);


    return (
        <div class={cc(_class, "se")}>
            {
                search.params.map(p => (
                    <SearchToken class="se_token" {...TOKEN_PARAMS[p.param]()} />
                ))
            }
        </div>
    )
}