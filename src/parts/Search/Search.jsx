import cc from "clsx";
import { useContext, useState } from "preact/hooks";
import { SearchToken } from "..";
import { SearchContext } from "..";
import "./Search.css";

/**
 * @callback SearchTokenFunc
 * @param {import("..").SearchParameter} p
 * @param {import("preact/hooks").StateUpdater<import("..").SearchContext>} dispatch 
 */

const typeDownshiftFactory = (items) => (p, dispatch) => {
    return {
        items: Object.keys(items),
        itemToString: s => items[s],
        selectedItem: p.type,
        onSelectedItemChange: ({selectedItem: type}) => dispatch({type: 'set', id: p.id, value: {type}})
    }
}

const equalGteOrLte = typeDownshiftFactory({
    'exact': '=',
    'gte': '≥',
    'lte': '≤'
});

/** @type {Record<string, SearchTokenFunc>} */
const TOKEN_PARAMS = {
    'default': function(p, dispatch) {
        return {
            onClose: () => dispatch({type: 'remove', id: p.id})
        }
    },
    'difficulty': function(p, dispatch) {
        return {
            label: 'difficulty',
            typeDownshiftArgs: equalGteOrLte(p, dispatch),
            valueArgs: {
                items: [0, 1, 2, 3],
                itemToString: n => ['easy', 'medium', 'tough', 'very tough'][n],
                selectedItem: p.value,
                onSelectedItemChange: ({selectedItem: value}) => dispatch({type: 'set', id: p.id, value: {value}})
            }
        }
    },
    'approval': function(p, dispatch) {
        return {
            label: 'approval',
            typeDownshiftArgs: equalGteOrLte(p, dispatch),
            valueType: 'number',
            valueArgs: {
                value: p.value,
                onChange: evt => {
                    const v = parseInt(evt.target.value);
                    if (!Number.isNaN(v)) {
                        dispatch({type: 'set', id: p.id, value: {value: v}});
                    }
                }
            }
        }
    },
    'tags': function(p, dispatch) {
        return {
            label: "tag",
            hideType: true,
            valueType: 'text',
            valueArgs: {
                onChange: evt => {
                    dispatch({type: 'set', id: p.id, value: {value: evt.target.value}})
                },
                value: p.value
            }
        }
    },
    'authors': function(p, dispatch) {
        return {
            label: "author",
            hideType: true,
            valueType: 'text',
            valueArgs: {
                onChange: evt => {
                    dispatch({type: 'set', id: p.id, value: {value: evt.target.value}})
                },
                value: p.value
            }
        }
    },
    'max_bpm': function(p, dispatch) {
        return {
            label: 'BPM',
            typeDownshiftArgs: equalGteOrLte(p, dispatch),
            valueType: 'number',
            valueArgs: {
                value: p.value,
                onChange: evt => {
                    const v = parseInt(evt.target.value);
                    if (!Number.isNaN(v)) {
                        dispatch({type: 'set', id: p.id, value: {value: v}});
                    }
                }
            }
        }
    },
    'single_player': function(p, dispatch) {
        return {
            label: '1P',
            hideType: true,
            valueArgs: {
                items: [1, 0],
                itemToString: n => ['no', 'yes'][n],
                selectedItem: p.value,
                onSelectedItemChange: ({selectedItem: value}) => dispatch({type: 'set', id: p.id, value: {value}})
            }
        }
    },
    'two_player': function(p, dispatch) {
        return {
            label: '2P',
            hideType: true,
            valueArgs: {
                items: [1, 0],
                itemToString: n => ['no', 'yes'][n],
                selectedItem: p.value,
                onSelectedItemChange: ({selectedItem: value}) => dispatch({type: 'set', id: p.id, value: {value}})
            }
        }
    }
}

/**
 * @typedef AddAFilterProps
 * @param {string?} class 
 */

export function AddAFilter({"class": _class}) {
    const [show, setShow] = useState(false);

    return (
        <div class={cc("af", _class)}>
            <button onClick={() => setShow(prev => !prev)} class="af_button">
                <i class="fas fa-filter"></i>
            </button>
            <ul class={cc("af_list", show && "visible!af_list")}>
                <span class="af_message">add a filter to the search</span>
                {
                    ["a", "b", "c", "d"].map(s => (
                        <li>
                            <button>{s}</button>
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}

/**
 * @typedef SearchProps
 * @property {string?} class
 */

/** @param {SearchProps} */
export function Search({"class": _class}) {
    const [search, dispatch] = useContext(SearchContext);

    return (
        <div class={cc(_class, "se")}>
            {
                search.params.map(p => (
                    <SearchToken class="se_token" {...TOKEN_PARAMS['default'](p, dispatch)} {...TOKEN_PARAMS[p.param](p, dispatch)} />
                ))
            }
            <AddAFilter class="se_add" />
            {/* <div class="se_addbox">
                <button onClick={() => setShowFilterMenu(prev => !prev)} class="se_add">
                    <i class="fas fa-filter"></i>
                </button>
                <ul class={cc("se_addlist", showFilterMenu && "visible!se_addlist")}>
                    <span>add a filter to the search</span>
                    {
                        ["a", "b", "c", "d"].map(s => (
                            <li>
                                <button>{s}</button>
                            </li>
                        ))
                    }
                </ul>
            </div> */}
        </div>
    )
}