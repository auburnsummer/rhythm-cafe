import "./Sidebar.css";
import cc from "clsx";
import { WithClass } from "@orchard/utils/types";
import { useLevels } from "@orchard/hooks/useLevels";

import { FacetSelect } from "@orchard/components/FacetSelect";
import { SlidySelect } from "@orchard/components/SlidySelect";
import { As, usePreference } from "@orchard/store";

type SidebarProps = {} & WithClass;
export function Sidebar({"class": _class}: SidebarProps) {
    const { data: resp } = useLevels();

    const facets = resp?.data.facet_counts;

    const difficultyName = (v: string) => ["Easy", "Medium", "Tough", "Very Tough"][parseInt(v)];

    const [advancedFilters] = usePreference("show advanced filters", As.BOOLEAN);

    return (
        <aside class={cc(_class, "sb")}>
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
                            showSwitch={false}
                            showFilter={false}
                        />
                        <SlidySelect class="sb_facet" humanName="BPM" facetName="bpm" min={0} max={1000} step={10} />
                        {
                            advancedFilters && (
                                <SlidySelect class="sb_facet" humanName="Peer Review" facetName="approval" min={-10} max={20} step={1}/>
                            )
                        }
                    </>
                )
            }
        </aside>
    )
}