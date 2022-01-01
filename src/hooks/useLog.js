import { useEffect } from "preact/hooks";


export function useLog(value) {
    useEffect(() => {
        console.log(value);
    }, [value]);
}