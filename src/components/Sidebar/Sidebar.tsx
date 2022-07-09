import './Sidebar.css';
import cc from 'clsx';
import { WithClass } from '@orchard/utils/types';
import { useLevels } from '@orchard/hooks/useLevels';

import { FacetSelect } from '@orchard/components/FacetSelect';
import { SlidySelect } from '@orchard/components/SlidySelect';
import { usePreference } from '@orchard/store';
import { SimplePeerReviewSelect } from '@orchard/components/SimplePeerReviewSelect';

type SidebarProps = WithClass;
export function Sidebar({'class': _class}: SidebarProps) {
    return (
        <></>
    );
    const { data: resp } = useLevels();

    const facets = resp?.data.facet_counts;

    const difficultyName = (v: string) => ['Easy', 'Medium', 'Tough', 'Very Tough'][parseInt(v)];

    const [advancedFilters] = usePreference('show advanced filters');

    return (
        <aside class={cc('sb', _class)}>
            {
                facets && (
                    <>
                        <FacetSelect class="sb_facet" facetName="tags" humanName="Tags" />
                        <FacetSelect class="sb_facet" facetName="authors" humanName="Authors" />
                        <FacetSelect class="sb_facet" facetName="artist" humanName="Artist" />
                        <FacetSelect
                            class="sb_facet"
                            facetName="difficulty"
                            humanName="Difficulty"
                            valueTransformFunc={difficultyName}
                            sortByFunc={s => s.value}
                            showSwitch={false}
                            showFilter={false}
                        />
                        <SlidySelect class="sb_facet" humanName="BPM" facetName="bpm" min={0} max={1000} step={10} />
                        {
                            !advancedFilters && (
                                <SimplePeerReviewSelect class="sb_facet" />
                            )
                        }
                        {
                            advancedFilters && (
                                <SlidySelect class="sb_facet" humanName="Peer Review" facetName="approval" min={-10} max={20} step={1}/>
                            )
                        }
                    </>
                )
            }
        </aside>
    );
}