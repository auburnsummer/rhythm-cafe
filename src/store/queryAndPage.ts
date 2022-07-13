import { atom, useAtom } from 'jotai';

const queryAtom = atom('', (_get, set, by: string) => {
    set(queryAtom, by);
    set(pageAtom, 1);
});
const pageAtom = atom(1);

export const useQuery = () => useAtom(queryAtom);
export const usePage = () => useAtom(pageAtom);