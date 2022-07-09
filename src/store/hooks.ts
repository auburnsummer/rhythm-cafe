export * from "./queryAndPage";
export * from "./preferences";
export * from "./filters";

// import create from 'zustand';
// import {enableMapSet} from 'immer';
// import { immer } from "zustand/middleware/immer";
// import { persist } from "zustand/middleware";
// import { WritableDraft } from 'immer/dist/types/types-external';
// import { OrchardState, FilterMap, PreferenceKey, FilterKey, Filter, FilterMap2, FacetFilter, RangeFilter } from './types';
// import { tuple } from '@orchard/utils/grabbag';
// import { VoidFunc } from '@orchard/utils/types';
// // @ts-ignore: This is JavaScript for now, typechecking JSON is hard :()
// import { stringify, parse } from '@orchard/utils/json_map_set.js';
// import { merge } from 'lodash-es';
// enableMapSet();

// import { atom, useAtom } from 'jotai';
// import { atomFamily } from 'jotai/utils';
// import { atomWithImmer } from 'jotai/immer';
// import { useMemo } from 'preact/hooks';

// const queryAtom = atom('');
// const pageAtom = atom(1);

// const useQueryAtom = atom(
//     get => get(queryAtom),
//     (_, set, newQuery: string) => {
//         set(queryAtom, newQuery);
//         set(pageAtom, 1);
//     }
// );

// const difficultyFilterAtom = atomWithImmer<FacetFilter>({type: 'in', active: true, values: new Set([] as number[])});
// const authorsFilterAtom = atomWithImmer<FacetFilter>({type: 'all', active: true, values: new Set([] as string[])});
// const tagsFilterAtom = atomWithImmer<FacetFilter>({type: 'all', active: true, values: new Set([] as string[])});
// const artistsFilterAtom = atomWithImmer<FacetFilter>({type: 'in', active: true, values: new Set([] as string[])});
// const bpmFilterAtom = atomWithImmer<RangeFilter>({type: 'range', active: false, min: 0, max: 0});
// const approvalFilterAtom = atomWithImmer<RangeFilter>({type: 'range', active: true, min: 10, max: 20});

// export const useQuery = () => useAtom(useQueryAtom);

// export const usePage = () => useAtom(pageAtom);

// // const useTestWhat = () => useAtom(difficultyFilterAtom);

// // export const useFilter = <T extends FilterKey>(name: T) => {
// //     const atom = {
// //         "difficulty": difficultyFilterAtom,
// //         "authors": authorsFilterAtom,
// //         "tags": tagsFilterAtom,
// //         "artist": artistsFilterAtom,
// //         "bpm": bpmFilterAtom,
// //         "approval": approvalFilterAtom
// //     }[name];
// //     return useAtom(atom);
// // }

// export const useFilter = <T extends FilterKey>(name: T) => {
//     const filter = useStore(state => state.filters[name]);
//     const setFilter = useSetFilter(name);
//     return tuple(filter, setFilter);
// };

// export const useSetFilter = <T extends FilterKey>(name: T) => {
//     const _setFilter = useStore(state => state.setFilter);
//     const setFilter = (f: VoidFunc<WritableDraft<FilterMap>[T]>) => _setFilter<T>(name, f);
//     return setFilter;
// };

// // todo: this is the messiest part of the codebase, clean it up

// export const useStore = create<OrchardState>()(persist(immer(set => {
//     const [, setPage] = usePage();

//     return {
//         filters: {
//             difficulty: {type: 'in', active: true, values: new Set([])},
//             authors: {type: 'all', active: true, values: new Set([])},
//             tags: {type: 'all', active: true, values: new Set([])},
//             artist: {type: 'in', active: true, values: new Set([])},
//             bpm: {type: 'range',active: false, min: 0, max: 0},
//             approval: {type: 'range', active: true, min: 10, max: 20}
//         },
//         setFilter: <T extends FilterKey>(cat: T, func: VoidFunc<WritableDraft<FilterMap>[T]>) => set(draft => {
//             const toChange = draft.filters[cat];
//             if (toChange) {
//                 func(toChange);
//                 setPage(1);
//             }
//         }),
//         preferences: {
//             'levels per page': '25',
//             'show advanced filters': 'false',
//             'show more level details': 'false',
//             'use cf cache': 'true',
//             'row view': 'false',
//             'search as you type': 'false',
//             'exact search': 'false',
//             'force codex urls': 'false'
//         },
//         setPreference: (pref: PreferenceKey, value: string) => set(draft => {
//             draft.preferences[pref] = value;
//         })
//     };
// }), {
//     name: "orchard_persist",
//     version: 7,
//     partialize: state => ({
//         preferences: state.preferences,
//         filters: {
//             approval: state.filters.approval
//         }
//     }),
//     serialize: stringify,
//     deserialize: parse,
//     merge: (per, curr) => merge(curr, per)
// }));



// // api is like this: [pref, setPref] = usePreference(key, As.BOOLEAN)
// export const usePreference = <T,>(key: PreferenceKey, func: (s: string) => T) => {
//     const pref = useStore(state => state.preferences[key]);
//     const _setPreference = useStore(state => state.setPreference);
//     const setPreference = (s: string) => _setPreference(key, s);
//     return tuple(func(pref), setPreference);
// };

// export const As = {
//     STRING  : (s: string) => s,
//     NUMBER : (s: string) => parseInt(s),
//     BOOLEAN : (s: string) => s === 'true'
// };