import "./Sidebar.css";
import cc from "clsx";
import { WithClass } from "@orchard/types";
import { useLevels } from "@orchard/hooks/useLevels";

import { FacetSelect } from "@orchard/components/FacetSelect";

type SidebarProps = {} & WithClass;
export function Sidebar({"class": _class}: SidebarProps) {
    const { data: resp } = useLevels();

    const facets = resp?.data.facet_counts;

    return (
        <aside class={cc(_class, "sb")}>
            {
                // facets && facets.map(facet => {
                //     return facet && (
                //         <FacetSelect class="sb_facet" name={facet.field_name}/>
                //     )
                // })
                facets && (
                    <>
                        <FacetSelect class="sb_facet" facetName="tags" />
                        <FacetSelect class="sb_facet" facetName="authors" />
                        <FacetSelect class="sb_facet" facetName="artist" />
                        <FacetSelect class="sb_facet" facetName="difficulty" />
                    </>
                )
            }
        </aside>
    )
}