/**
 * A twine game style selector where you click to change a value inline.
 */

import {useMemo} from "https://cdn.skypack.dev/preact/hooks";
import { equals } from "https://cdn.skypack.dev/ramda";

export function useTwineSwitch(options, value, setValue) {

    const index = useMemo(() => {
        return options.findIndex(equals(value));
    }, [value]);

    const rotate = (dir = 1) => (evt) => {
        const newValue = options[(index + dir) % options.length];
        setValue(newValue);
    }

    return rotate;
}