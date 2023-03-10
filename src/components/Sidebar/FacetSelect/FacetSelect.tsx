import type { Level, SearchResponseFacetCountSchema } from '@orchard/hooks/useLevels';
import { useLevels } from '@orchard/hooks/useLevels';
import { Spinny } from '@orchard/icons';
import type { ImmerAtom, SetFilter } from '@orchard/store';
import { usePreference } from '@orchard/store';
import type { WithClass } from '@orchard/utils/types';
import cc from 'clsx';
import { useMemo, useState } from 'preact/hooks';
import './FacetSelect.css';
import sortBy from 'just-sort-by';
import { useAtom } from 'jotai/react';
import { castDraft, castImmutable } from 'immer';

type SortableValue = string | number;

/**
 * Configuration type for FacetSelect.
 */
type FacetSelectProps<T extends string | number> = {
    /**
     * The atom that's being controlled by this FacetSelect.
     */
    atom: ImmerAtom<SetFilter<T>>;
    /**
     * Name that appears above the selector.
     */
    humanName: string;
    /**
     * Whether to show the ability to switch "and"/"or" modes.
     * This isn't very functional at the moment.
     */
    showSwitch?: boolean;
    /**
     * Whether to show the search bar at the top of the filter.
     */
    showFilter?: boolean;
    /**
     * An optional function that can be provided to change the displayed values
     * of the facet. e.g. Difficulty's values are numbers from 0-3, but we want to show the words
     * "Easy", "Medium", etc.
     */
    valueDisplayFunc?: (s: T) => string;
    /**
     * The facets that come from Typesense are always strings. If T is not string,
     * a function must be provided to turn the values back.
     */
    stringToFacetFunc: (s: string) => T;
    /**
     * An optional function to sort the facet set. By default it sorts by count, descending.
     */
    sortByFunc?: (s: SearchResponseFacetCountSchema<Level>['counts'][number]) => SortableValue;
} & WithClass;


export function FacetSelect<T extends string | number>(
    {
        'class': _class,
        atom,
        humanName,
        'showSwitch': _showSwitch = true,
        showFilter = true,
        valueDisplayFunc = s => `${s}`,
        stringToFacetFunc,
        sortByFunc = s => s.count * -1
    }: FacetSelectProps<T>) {
    const [filter, setFilter] = useAtom(atom);

    const facetName = filter.name;
    const [input, setInput] = useState('');

    const { data: resp, isLoading } = useLevels(
        {
            maxFacetValues: 10,
            facetQuery: input ? `${facetName}:${input.trim()}` : undefined
        }
    );

    const facet = useMemo(() => {
        return resp?.data.facet_counts?.find(v => v.field_name === facetName);
    }, [resp]);

    const [advancedFilters] = usePreference('show advanced filters');
    const showSwitch = advancedFilters && _showSwitch;

    const selected = filter.values;
    const filterOp = filter.op;
    const total = facet?.stats.total_values || 0;

    const toggle = (value: string) => {
        const setValue = stringToFacetFunc(value);
        const currentlySelected = selected.has(setValue);
        const castValue = castDraft(setValue); // = setValue
        if (currentlySelected) {
            setFilter(d => {
                d.values.delete(castValue);
            });
        } else {
            setFilter(d => {
                d.values.add(castValue);
            });
        }
    };

    const toggleOp = () => {
        const newOp = filterOp === 'and' ? 'and' : 'or';
        setFilter(d => {
            d.op = newOp;
        });
    };

    return (
        <div class={cc(_class, 'fs', { 'laggy!fs': isLoading })}>
            <div class="fs_depo">
                <span class="fs_name">{humanName}</span>
                {total > 0 && <span class="fs_total">({total})</span>}
                {isLoading && <Spinny class="fs_spinny" />}
                <div class="fs_spacer" />
                {
                    filterOp && showSwitch && (
                        <div class="fs_switch">
                            <button
                                class="fs_switchbutton"
                                onClick={toggleOp}
                            >
                                {filterOp === 'or' ? 'or' : 'and'}
                            </button>
                        </div>
                    )
                }
            </div>
            {
                showFilter && (
                    <input
                        placeholder="Filter..."
                        class="fs_input"
                        type="text"
                        onInput={evt => setInput(evt.currentTarget.value)}
                    />
                )
            }
            <ul class="fs_list">
                {
                    facet && sortBy(facet.counts, sortByFunc).map(f => {
                        return (
                            <li class="fs_item" key={f.value}>
                                <label class="fs_control">
                                    <input
                                        class="fs_checkbox"
                                        type="checkbox"
                                        checked={selected.has(stringToFacetFunc(f.value))}
                                        onClick={() => toggle(f.value)}
                                    />
                                    {valueDisplayFunc(stringToFacetFunc(f.value))}
                                </label>
                                <span class="fs_count">({f.count})</span>
                            </li>
                        );
                    })
                }
            </ul>
        </div>
    );
}