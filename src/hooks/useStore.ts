import create from 'zustand'

type OrchardState = {
    q: string;
    setQuery: (to: string) => void;
}

export const useStore = create<OrchardState>(set => ({
    q: "",
    setQuery: (s: string) => set({q: s})
}));