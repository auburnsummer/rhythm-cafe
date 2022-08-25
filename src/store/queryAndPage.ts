import { atom, useAtom } from 'jotai';
import { artistFilterAtom, authorsFilterAtom, bpmFilterAtom, difficultyFilterAtom, SetFilter, tagsFilterAtom } from './filters';

const clearSetFilter = (f: SetFilter) => {
    f.values.clear();
};

const queryAtom = atom('', (_get, set, by: string) => {
    set(queryAtom, by);
    set(pageAtom, 1);
    set(difficultyFilterAtom, clearSetFilter);
    set(authorsFilterAtom, clearSetFilter);
    set(tagsFilterAtom, clearSetFilter);
    set(artistFilterAtom, clearSetFilter);
    set(bpmFilterAtom, f => {
        f.active = false;
    });
});
const pageAtom = atom(1);

export const useQuery = () => useAtom(queryAtom);
export const usePage = () => useAtom(pageAtom);