

import { Ref } from 'preact';
import { useCallback } from 'preact/hooks';

function setRef<T extends Element>(ref: Ref<T>, value: T | null): void {
    if (typeof ref === 'object') {
        ref.current = value;
    } else {
        ref(value);
    }
}

export function useForkRef<T extends Element>(r1?: Ref<T>, r2?: Ref<T>): Ref<T> {
    return useCallback((element: T | null) => {
        if (r1) {
            setRef<T>(r1, element);
        }
        if (r2) {
            setRef<T>(r2, element);
        }
    }, [r1, r2]);
}
