import { useEffect } from "preact/hooks";

export function useLog<T extends unknown>(s: T) {
    useEffect(() => {
        console.log(s);
    }, [s])
};