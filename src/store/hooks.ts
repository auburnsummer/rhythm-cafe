import create from 'zustand';
import produce, {enableMapSet} from "immer";
import { WritableDraft } from 'immer/dist/types/types-external';
import { OrchardState, FilterMap, PreferenceKey, Filter } from './types';
import { tuple } from '@orchard/utils/grabbag';

enableMapSet();

export const useStore = create<OrchardState>(_set => {
    const set = (func: (draft: WritableDraft<OrchardState>) => void) => {
        _set(state => produce(state, func))
    };
    return {
        q: "",
        setQuery: s => set(draft => {
            draft.q = s
        }),
        facetBy: ["authors", "tags", "source", "difficulty", "artist"],
        filters: {
            difficulty: {type: 'in', active: true, values: new Set([])},
            authors: {type: 'all', active: true, values: new Set([])},
            tags: {type: 'all', active: true, values: new Set([])},
            artist: {type: 'in', active: true, values: new Set([])},
            bpm: {type: 'range', active: false, min: 0, max: 0},
            approval: {type: 'range', active: true, min: 10, max: 20}
        },
        setFilter: <T extends keyof FilterMap,>(cat: T, func: (d: FilterMap[T]) => void) => set(draft => {
            const toChange = draft.filters[cat];
            if (toChange) {
                func(toChange);
            }
        }),
        preferences: {
            "levels per page": "15",
            "show advanced filters": "false",
            "show more level details": "false"
        },
        setPreference: (pref: PreferenceKey, value: string) => set(draft => {
            draft.preferences[pref] = value;
        })
    };
});

export const useQuery = () => {
    const q = useStore(state => state.q);
    const setQuery = useStore(state => state.setQuery);
    return tuple(q, setQuery);
};

export const useFilter = <T extends keyof FilterMap>(name: T) => {
    const filter = useStore(state => state.filters[name]);
    const _setFilter = useStore(state => state.setFilter);
    const setFilter = (f: (d: WritableDraft<Filter>) => void) => _setFilter(name, f);
    return tuple(filter, setFilter);
}

// api is like this: [pref, setPref] = usePreference(key, As.BOOLEAN)
export const usePreference = <T,>(key: PreferenceKey, func: (s: string) => T) => {
    const pref = useStore(state => state.preferences[key]);
    const _setPreference = useStore(state => state.setPreference);
    const setPreference = (s: string) => _setPreference(key, s);
    return tuple(func(pref), setPreference);
};

export const As = {
    STRING  : (s: string) => s,
    NUMBER : (s: string) => parseInt(s),
    BOOLEAN : (s: string) => s === "true"
}