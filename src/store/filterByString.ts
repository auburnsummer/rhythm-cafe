import { atom } from 'jotai/vanilla';
import { useAtom } from 'jotai/react';
import { allFilters } from './filters';


export const filterByStringAtom = atom(get => {
    const filters = get(allFilters);
    return filters
        .reduce((prev, filter) => {
            if (!filter) {
                return prev;
            } 
            if (!filter.active) {
                return prev;
            }
            if (filter.type === "set") {
                if (filter.values.size === 0) {
                    return prev;
                }
                if (filter.op === 'and') {
                    const values = [...filter.values];
                    const nexts = values.map(v => `${filter.name}:=${v}`);
                    return [...prev, ...nexts];    
                }
                if (filter.op === 'or') {
                    const values = [...filter.values];
                    const next = `${filter.name}:=[${values.join(',')}]`;
                    return [...prev, next];
                }
            }
            // special handling of bpm...
            if (filter.type === 'range' && filter.name === 'bpm') {
                const { min, max } = filter;
                // both the min_bpm and the max_bpm need to be within specified range.
                // mostly because the "or" version requires typesense to do funky stuff i'm not sure yet...
                const nexts = [
                    `max_bpm:=[${min}..${max}]`,
                    `min_bpm:=[${min}..${max}]`
                ];
                return [...prev, ...nexts];
            }
            // other range filters.
            if (filter.type === 'range') {
                const { min, max, name } = filter;
                const next = `${name}:=[${min}..${max}]`;
                return [...prev, next];
            }
            return prev;
        }, [] as string[])
        .join(' && ');
});

export const useFilterByString = () => useAtom(filterByStringAtom);
