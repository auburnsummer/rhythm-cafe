import { useLevels } from '@orchard/hooks/useLevels';
import { usePage, usePreference, useQuery } from '@orchard/store';
import { WithClass } from '@orchard/utils/types';
import './LevelsControls.css';
import cc from 'clsx';

type LevelsControlsProps = WithClass;
export function LevelsControls({'class': _class}: LevelsControlsProps) {
    const { data: resp, isLagging } = useLevels();
    const [page, setPage] = usePage();
    const [levelsPerPage] = usePreference('levels per page');
    const [q] = useQuery();
    const hasPreviousPage = page > 1;
    const hasNextPage = resp && ((page) * levelsPerPage) < resp.data.found;

    const totalPages = Math.ceil((resp?.data.found || 0) / levelsPerPage);

    return (
        <div class={cc(_class, 'le')}>
            {
                q && resp?.data.found && !isLagging && (
                    <div class="le_results">
                        <p>{resp?.data.found} levels found for {q} </p>
                    </div>
                )
            }
            <div class="le_spacer" />
            {
                (hasPreviousPage || hasNextPage) && (
                    <div class="le_pagecontrols">
                        {hasPreviousPage && <button onClick={() => setPage(page - 1)} class="le_perv">prev</button>}
                        <span class="le_page">{page} of {totalPages}</span>
                        {hasNextPage && <button onClick={() => setPage(page + 1)} class="le_next">next</button>}                 
                    </div>
                )
            }

        </div>
    );
}