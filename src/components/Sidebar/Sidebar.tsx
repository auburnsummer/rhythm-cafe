import './Sidebar.css';
import cc from 'clsx';
import type { WithClass } from '@orchard/utils/types';
import { useLevels } from '@orchard/hooks/useLevels';

import { approvalFilterAtom, artistFilterAtom, authorsFilterAtom, difficultyFilterAtom, tagsFilterAtom, usePreference } from '@orchard/store';
import { FacetSelect } from '@orchard/components/Sidebar/FacetSelect';
import { SimplePeerReviewSelect } from '@orchard/components/Sidebar/SimplePeerReviewSelect';
import { SlidySelect } from '@orchard/components/Sidebar/SlidySelect';
import { identity } from '@orchard/utils/grabbag';

type SidebarProps = WithClass;
export function Sidebar({ 'class': _class }: SidebarProps) {
    const { data: resp } = useLevels();

    const facets = resp?.data.facet_counts;

    const difficultyName = (v: number) => ['Easy', 'Medium', 'Tough', 'Very Tough'][v];

    const [advancedFilters] = usePreference('show advanced filters');

    return (
        <aside class={cc('sb', _class)}>
            {
                facets && (
                    <>
                        <FacetSelect class="sb_facet" atom={tagsFilterAtom} stringToFacetFunc={identity} humanName="Tags" />
                        <FacetSelect class="sb_facet" atom={authorsFilterAtom} stringToFacetFunc={identity} humanName="Authors" />
                        <FacetSelect class="sb_facet" atom={artistFilterAtom} stringToFacetFunc={identity} humanName="Artist" />
                        <FacetSelect
                            class="sb_facet"
                            atom={difficultyFilterAtom}
                            humanName="Difficulty"
                            valueDisplayFunc={difficultyName}
                            stringToFacetFunc={parseInt}
                            sortByFunc={s => s.value}
                            showSwitch={false}
                            showFilter={false}
                        />
                        {/* <SlidySelect class="sb_facet" humanName="BPM" atom={bpmFilterAtom} min={0} max={1000} step={10} /> */}
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