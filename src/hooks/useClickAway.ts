import { RefObject } from 'preact';
import { useEffect } from 'preact/hooks';

const EVENT = 'mousedown';

export const useClickAway = <T extends Node,>(ref: RefObject<T>, callback: (e: Event) => void) => {
    useEffect(() => {
        const listener: EventListener = (event) => {
            const target = event.target as Element;

            if (!ref || !ref.current || ref.current.contains(target)) {
                return;
            }
            callback(event);
        };
        document.addEventListener(EVENT, listener);
        return () => {
            document.removeEventListener(EVENT, listener);
        };
    }, [ref, callback]);
};