import create from 'zustand';
import produce, {enableMapSet} from "immer";
import { WritableDraft } from 'immer/dist/types/types-external';
import { OrchardState, FilterMap, PreferenceKey, Filter, Preferences, FilterKey } from './types';
import { getKeys, tuple } from '@orchard/utils/grabbag';
import { VoidFunc } from '@orchard/utils/types';

enableMapSet();

export const useStore = create<OrchardState>(_set => {
    const set = (func: (draft: WritableDraft<OrchardState>) => void) => {
        _set(state => produce(state, func))
    };

    const defaultPrefs : Preferences = {
        "levels per page": "25",
        "show advanced filters": "false",
        "show more level details": "false",
        "use cf cache": "true"
    };

    const localStoragePrefs = getKeys(defaultPrefs).reduce((prev, curr) => {
        const key = `pref:${curr}`;
        const prefMaybe = localStorage.getItem(key);
        return prefMaybe ? {
            ...prev,
            [curr]: prefMaybe
        } : prev;
    }, {} as Partial<Preferences>);

    const prefs = {
        ...defaultPrefs,
        ...localStoragePrefs
    };

    return {
        q: "",
        setQuery: s => set(draft => {
            draft.q = s
            draft.page = 1
        }),
        page: 1,
        setPage: n => set(draft => {
            draft.page = n
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
        setFilter: <T extends FilterKey>(cat: T, func: VoidFunc<WritableDraft<FilterMap>[T]>) => set(draft => {
            const toChange = draft.filters[cat];
            if (toChange) {
                func(toChange);
            }
        }),
        preferences: prefs,
        setPreference: (pref: PreferenceKey, value: string) => set(draft => {
            const key = `pref:${pref}`;
            try {
                localStorage.setItem(key, value);
            } catch (err) {
                // ignore it. if we can't use localStorage that's fine, it just means the pref won't persist.
            }
            draft.preferences[pref] = value;
        })
    };
});

export const useQuery = () => {
    const q = useStore(state => state.q);
    const setQuery = useStore(state => state.setQuery);
    return tuple(q, setQuery);
};

export const usePage = () => {
    const page = useStore(state => state.page);
    const setPage = useStore(state => state.setPage);
    return tuple(page, setPage);
};

export const useFilter = <T extends FilterKey>(name: T) => {
    const filter = useStore(state => state.filters[name]);
    const setFilter = useSetFilter(name);
    return tuple(filter, setFilter);
};

export const useSetFilter = <T extends FilterKey>(name: T) => {
    const _setFilter = useStore(state => state.setFilter);
    const setFilter = (f: VoidFunc<WritableDraft<FilterMap>[T]>) => _setFilter<T>(name, f);
    return setFilter;
};

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