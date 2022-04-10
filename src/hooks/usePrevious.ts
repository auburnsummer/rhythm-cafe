import { useCallback, useEffect, useState } from 'preact/hooks';

export default function usePrevious<T>(state: T): [T | undefined, () => void] {
    const [h, setH] = useState<(T | undefined)[]>([]);

    useEffect(() => {
        if (state !== undefined) {
            setH(prev => [prev.length ? prev.at(-1) : state, state]);
        }
    }, [state]);

    const reset = useCallback(() => {
        setH(_ => []);
    }, []);

    const prev = h.length > 1 ? h.at(-2) : undefined;

    return [prev, reset];
}
