import { KeyOfType, WithClass } from "@orchard/utils/types";
import "./SlidySelect.css";

import cc from "clsx";
import { useState } from "preact/hooks";
import { clamp } from "@orchard/utils/grabbag";
import { FilterMap, RangeFilter, useFilter, useStore } from "@orchard/store";

type SlidySelectProps = {
    facetName: KeyOfType<FilterMap, RangeFilter>;
    humanName: string;
    min: number;
    max: number;
    step: number;
} & WithClass;

// version 1 of SlidySelect is just two number boxes lol
// eventually I want to have an actual slidy thing
export function SlidySelect({"class": _class, facetName, min, max, step, humanName}: SlidySelectProps) {
    const [filter, setFilter] = useFilter(facetName);

    const isActive = filter.active;

    const [showingPlaceholders, setShowingPlaceholders] = useState(!isActive); // show placeholders at beginning.

    const [currMin, setCurrMin] = useState(isActive ? filter.min : min);
    const [currMax, setCurrMax] = useState(isActive ? filter.max : max);

    const onMinInput = (n: number) => {
        setShowingPlaceholders(false);
        setCurrMin(clamp(n, min, currMax));
    }

    const onMaxInput = (n: number) => {
        setShowingPlaceholders(false);
        setCurrMax(clamp(n, currMin, max));
    }

    const onClick: JSX.MouseEventHandler<HTMLButtonElement> = _ => {
        setFilter(draft => {
            if (draft.type != 'range') {
                return;
            }
            draft.active = true;
            draft.min = currMin;
            draft.max = currMax;
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
                <span class="ss_name">{humanName}</span>
                {isActive && <button class="ss_clear" onClick={clear}>clear</button>}
            </div>
            <div class="ss_anne">
                <input
                    class="ss_input"
                    type="number"
                    step={step}
                    min={min}
                    max={currMax}
                    value={!showingPlaceholders ? currMin : undefined}
                    placeholder={`${min}`}
                    onInput={evt => onMinInput(parseInt(evt.currentTarget.value))}
                />
                <span class="ss_to">to</span>
                <input
                    class="ss_input"
                    type="number"
                    step={step}
                    min={currMin}
                    max={max}
                    value={!showingPlaceholders ? currMax : undefined}
                    placeholder={`${500}`}
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