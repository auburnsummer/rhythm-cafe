import './SimplePeerReviewSelect.css';
import cc from 'clsx';
import type { WithClass } from '@orchard/utils/types';

import { useApprovalFilter } from '@orchard/store';
import { useMemo } from 'preact/hooks';

type SimplePeerReviewSelectProps = WithClass;
export function SimplePeerReviewSelect({ 'class': _class }: SimplePeerReviewSelectProps) {
    const [filter, setFilter] = useApprovalFilter();

    type PRState = 'only peer reviewed levels' | 'all levels' | 'unknown';

    const state : PRState = useMemo(() => {
        if (filter.min == 10) {
            return 'only peer reviewed levels';
        }
        if (filter.min < 0 && filter.max >= 10) {
            return 'all levels';
        }
        return 'unknown';
    }, [filter]);


    return (
        <div class={cc(_class, 'sp')}>
            <span class="fs_name">Peer Review</span>
            <div class="sp_row">
                <input
                    type="radio"
                    class="sp_radio"
                    checked={state === 'only peer reviewed levels'}
                    onChange={_ => setFilter(d => {
                        d.min = 10;
                        d.max = 20;
                        d.active = true;
                    })}
                />
                <span>Only peer-reviewed levels</span>
            </div>
            <div class="sp_row">
                <input
                    type="radio"
                    class="sp_radio"
                    checked={state === 'all levels'}
                    onChange={_ => setFilter(d => {
                        d.min = -1;
                        d.max = 20;
                        d.active = true;
                    })}
                />
                <span>All levels</span>
            </div>
        </div>
    );
}