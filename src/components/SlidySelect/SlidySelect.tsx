import { WithClass } from '@orchard/utils/types';
import './SlidySelect.css';

import cc from 'clsx';
import { useEffect, useState } from 'preact/hooks';
import { clamp } from '@orchard/utils/grabbag';
import { RangeFilter } from '@orchard/store';
import { ImmerAtom } from '@orchard/store/customAtoms';
import { useAtom } from 'jotai';

type SlidySelectProps = {
    atom: ImmerAtom<RangeFilter>;
    humanName: string;
    min: number;
    max: number;
    step: number;
} & WithClass;

// version 1 of SlidySelect is just two number boxes lol
// eventually I want to have an actual slidy thing
export function SlidySelect({'class': _class, atom, min, max, step, humanName}: SlidySelectProps) {
    const [filter, setFilter] = useAtom(atom);

    const isActive = filter.active;

    const [currMin, setCurrMin] = useState(filter.min);
    const [currMax, setCurrMax] = useState(filter.max);

    useEffect(() => {
        if (!filter.active) {
            setCurrMin(NaN);
            setCurrMax(NaN);
        }
        else {
            setCurrMin(filter.min);
            setCurrMax(filter.max);
        }

    }, [filter]);

    const onClick: JSX.MouseEventHandler<HTMLButtonElement> = _ => {
        setFilter(draft => {
            draft.active = true;
            draft.min = clamp(currMin, min, currMax);
            draft.max = clamp(currMax, currMin, max);
        });
    };

    const clear: JSX.MouseEventHandler<HTMLButtonElement> = _ => {
        setFilter(draft => {
            draft.active = false;
        });
    };


    return (
        <div class={cc(_class, 'ss')}>
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
                    max={max}
                    value={currMin}
                    placeholder={`${min}`}
                    onInput={evt => {
                        setCurrMin(parseInt(evt.currentTarget.value));
                    }}
                />
                
                <span class="ss_to">to</span>
                <input
                    class="ss_input"
                    type="number"
                    step={step}
                    min={min}
                    max={max}
                    value={currMax}
                    placeholder={`${max}`}
                    onInput={evt => {
                        setCurrMax(parseInt(evt.currentTarget.value));
                    }}
                />
                <button
                    onClick={onClick}
                    class="ss_go"
                >
                    Go
                </button> 
            </div>
        </div>
    );
}