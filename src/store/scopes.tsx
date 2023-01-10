import { Provider } from "jotai/react";
import { createStore } from "jotai/vanilla";
import type { ComponentChildren } from "preact";

type GlobalJotaiScopeProviderProps = {
    children: ComponentChildren;
}

export const globalStore = createStore();

export function GlobalJotaiScopeProvider({children}: GlobalJotaiScopeProviderProps) {
    return (
        <Provider store={globalStore}>
            {children}
        </Provider>
    )
}