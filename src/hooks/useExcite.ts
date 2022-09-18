/*
A variable which starts at false. use the excite function to temporarily change it to true, but it
goes back to false after a timeout.
*/

import { tuple } from '@orchard/utils/grabbag';
import { useTimeoutEffect } from '@react-hookz/web/esnext';
import { useState } from 'preact/hooks';

export function useExcite(timeout: number) {
    const [state, setState] = useState(false);

    const [, reset] = useTimeoutEffect(() => setState(false), timeout);

    const excite = () => {
        if (!state) {
            setState(true);
            reset();
        }
    };

    return tuple(state, excite);
}