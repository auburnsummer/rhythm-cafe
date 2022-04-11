import { useLevels } from "@orchard/hooks/useLevels";
import { useStore, OrchardState } from "@orchard/hooks/useStore";
import { Level, SearchResponseFacetCountSchema, WithClass } from "@orchard/types";
import cc from "clsx";
import { useState } from "preact/hooks";
import "./FacetSelect.css";

type FacetSelectProps = {
    name: string;
} & WithClass;
export function FacetSelect({"class": _class, name}: FacetSelectProps) {
    const [input, setInput] = useState("")
    const { data: resp } = useLevels(
        {
            maxFacetValues: 10,
            facetQuery: input ? `${name}:${input.trim()}` : undefined
        }
    );

    const facet = resp?.data.facet_counts?.find(v => v.field_name === name);
    const total = facet?.stats.total_values || 0;

    const _selected = useStore(state => state.filters[name]?.values);
    const selected = _selected || new Set([]);
    const setFilter = useStore(state => state.setFilter);

    const toggle = (value: string) => {
        const currentlySelected = selected.has(value);
        if (currentlySelected) {
            setFilter(name, d => {
                d.values.delete(value);
            });
        } else {
            setFilter(name, d => {
                d.values.add(value);
            });
        }
    }

    return (
        <div class={cc(_class, "fs")}>
            <div class="fs_depo">
                <span class="fs_name">{name}</span>
                {total > 0 && <span class="fs_total">({total})</span>}
            </div>
            <input placeholder="Filter..." class="fs_input" type="text" onInput={evt => setInput(evt.currentTarget.value)}/>
            <ul class="fs_list">
                {
                    facet && facet.counts.map(f => {
                        return (
                            <li class="fs_item">
                                <label class="fs_control">
                                    <input
                                        class="fs_checkbox"
                                        type="checkbox"
                                        checked={selected.has(f.value)}
                                        onClick={() => toggle(f.value)}
                                    />
                                    {f.value}
                                </label>
                                <span class="fs_count">({f.count})</span>
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
}