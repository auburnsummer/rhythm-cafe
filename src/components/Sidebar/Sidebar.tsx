import './Sidebar.css';
import cc from 'clsx';
import { WithClass } from '@orchard/utils/types';
import { useLevels } from '@orchard/hooks/useLevels';

import { approvalFilterAtom, artistFilterAtom, authorsFilterAtom, bpmFilterAtom, difficultyFilterAtom, tagsFilterAtom, usePreference } from '@orchard/store';
import { FacetSelect } from '@orchard/components/FacetSelect';
import { SimplePeerReviewSelect } from '@orchard/components/SimplePeerReviewSelect';
import { SlidySelect } from '@orchard/components/SlidySelect';

type SidebarProps = WithClass;
export function Sidebar({'class': _class}: SidebarProps) {
    const { data: resp } = useLevels();

    const facets = resp?.data.facet_counts;

    const difficultyName = (v: string) => ['Easy', 'Medium', 'Tough', 'Very Tough'][parseInt(v)];

    const [advancedFilters] = usePreference('show advanced filters');

    return (
        <aside class={cc('sb', _class)}>
            {
                facets && (
                    <>
                        <FacetSelect class="sb_facet" atom={tagsFilterAtom} humanName="Tags" />
                        <FacetSelect class="sb_facet" atom={authorsFilterAtom} humanName="Authors" />
                        <FacetSelect class="sb_facet" atom={artistFilterAtom} humanName="Artist" />
                        <FacetSelect
                            class="sb_facet"
                            atom={difficultyFilterAtom}
                            humanName="Difficulty"
                            valueTransformFunc={difficultyName}
                            sortByFunc={s => s.value}
                            showSwitch={false}
                            showFilter={false}
                        />
                        <SlidySelect class="sb_facet" humanName="BPM" atom={bpmFilterAtom} min={0} max={1000} step={10} />
                        {
                            !advancedFilters
                                ? <SimplePeerReviewSelect class="sb_facet" />
                                : <SlidySelect class="sb_facet" humanName="Peer Review" atom={approvalFilterAtom} min={-10} max={20} step={1}/>
                        }
                    </>
                )
            }
        </aside>
    );
}