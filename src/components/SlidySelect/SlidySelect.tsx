import { KeyOfType, WithClass } from "@orchard/utils/types";
import "./SlidySelect.css";

import cc from "clsx";
import { useState } from "preact/hooks";
import { clamp } from "@orchard/utils/grabbag";
import { FilterMap, RangeFilter, useFilter, useStore } from "@orchard/store";

type SlidySelectProps = {
    facetName: KeyOfType<FilterMap, RangeFilter>;
    humanName: string;
} & WithClass;

// version 1 of SlidySelect is just two number boxes lol
// eventually I want to have an actual slidy thing
export function SlidySelect({"class": _class, facetName, humanName}: SlidySelectProps) {
    const [showingPlaceholders, setShowingPlaceholders] = useState(true); // show placeholders at beginning.
    const [min, setMin] = useState(0);
    const [max, setMax] = useState(500);

    const [filter, setFilter] = useFilter(facetName);

    const isActive = filter.active;

    const onMinInput = (n: number) => {
        setShowingPlaceholders(false);
        setMin(clamp(n, 0, max));
    }

    const onMaxInput = (n: number) => {
        setShowingPlaceholders(false);
        setMax(clamp(n, min, 500));
    }

    const onClick: JSX.MouseEventHandler<HTMLButtonElement> = _ => {
        setFilter(draft => {
            if (draft.type != 'range') {
                return;
            }
            draft.active = true;
            draft.min = min;
            draft.max = max;
        })
    };

    const clear: JSX.MouseEventHandler<HTMLButtonElement> = _ => {
        setFilter(draft => {
            if (draft.type != 'range') {
                return;
            }
            draft.active = false;
        })
    };

    return (
        <div class={cc(_class, "ss")}>
            <div class="ss_depo">
                <span class="fs_name">{humanName}</span>
                {isActive && <button onClick={clear}>clear</button>}
            </div>
            <div class="ss_anne">
                <input
                    class="ss_input"
                    type="number"
                    step={10}
                    min={0}
                    max={max}
                    value={!showingPlaceholders ? min : undefined}
                    placeholder="0"
                    onInput={evt => onMinInput(parseInt(evt.currentTarget.value))}
                />
                <span class="ss_to">to</span>
                <input
                    class="ss_input"
                    type="number"
                    step={10}
                    min={min}
                    max={500}
                    value={!showingPlaceholders ? max : undefined}
                    placeholder="500"
                    onInput={evt => onMaxInput(parseInt(evt.currentTarget.value))}
                />
                <button
                    onClick={onClick}
                    class="ss_go"
                >
                    Go
                </button>
            </div>
        </div>
    )
}