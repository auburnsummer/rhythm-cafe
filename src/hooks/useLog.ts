import { useEffect } from 'preact/hooks';

export function useLog<T>(s: T) {
    useEffect(() => {
        console.log(s);
    }, [s]);
}