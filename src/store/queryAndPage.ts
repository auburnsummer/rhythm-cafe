import { atom } from 'jotai/vanilla';
import { useAtom } from 'jotai/react';
import type { SetFilter } from './filters';
import { artistFilterAtom, authorsFilterAtom, bpmFilterAtom, difficultyFilterAtom, tagsFilterAtom } from './filters';
import { WritableDraft } from 'immer/dist/internal';

const clearSetFilter = (f: WritableDraft<SetFilter>) => {
    f.values.clear();
};

const queryAtom = atom('', (_get, set, by: string) => {
    set(queryAtom, by);
    set(pageAtom, 1);
    set(difficultyFilterAtom, clearSetFilter);
    set(artistFilterAtom, clearSetFilter);
    set(authorsFilterAtom, clearSetFilter);
    set(tagsFilterAtom, clearSetFilter);
    set(bpmFilterAtom, f => { f.active = false; });
});

// 1-indexed.
export const pageAtom = atom(1);

export const useQuery = () => useAtom(queryAtom);
export const usePage = () => useAtom(pageAtom);