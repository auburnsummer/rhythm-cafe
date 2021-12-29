import { useEffect } from "preact/hooks";
import { useMitt } from "./useMitt";


export function useMittEvent(evtName, func, deps) {
    const E = useMitt();

    useEffect(() => {
        E.on(evtName, func);
        return () => {
            E.off(evtName, func);
        }
    }, [E, func, ...deps]);
}