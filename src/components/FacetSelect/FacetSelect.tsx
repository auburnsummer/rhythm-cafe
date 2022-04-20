import { Level, SearchResponseFacetCountSchema, useLevels } from '@orchard/hooks/useLevels';
import { Spinny } from '@orchard/icons';
import { As, FacetFilter, FilterMap, useFilter, usePreference } from '@orchard/store';
import { KeyOfType, WithClass } from '@orchard/utils/types';
import cc from 'clsx';
import { useMemo, useState } from 'preact/hooks';
import './FacetSelect.css';
import { identity, sortBy } from 'lodash-es';

type SortableValue = string | number;

type FacetSelectProps = {
    facetName: KeyOfType<FilterMap, FacetFilter>;
    humanName: string;
    showSwitch?: boolean;
    showFilter?: boolean;
    valueTransformFunc?: (s: string) => string;
    sortByFunc?: (s: SearchResponseFacetCountSchema<Level>['counts'][number]) => SortableValue;
} & WithClass;

export function FacetSelect(
    {
        'class': _class,
        facetName,
        humanName,
        'showSwitch': _showSwitch = true,
        showFilter = true,
        valueTransformFunc = s => `${s}`,
        sortByFunc = identity
    }: FacetSelectProps) {
    const [input, setInput] = useState('');
    const { data: resp, isLagging } = useLevels(
        {
            maxFacetValues: 10,
            facetQuery: input ? `${facetName}:${input.trim()}` : undefined
        }
    );
    const facet = useMemo(() => {
        return resp?.data.facet_counts?.find(v => v.field_name === facetName);
    }, [resp]);

    const [filter, setFilter] = useFilter(facetName);
    const [advancedFilters] = usePreference('show advanced filters', As.BOOLEAN);
    const showSwitch = advancedFilters && _showSwitch;

    const selected = filter.values || new Set([]);
    const filterType = filter.type;
    const total = facet?.stats.total_values || 0;

    const toggle = (value: string) => {
        const currentlySelected = selected.has(value);
        if (currentlySelected) {
            setFilter(d => {
                d.values.delete(value);
            });
        } else {
            setFilter(d => {
                d.values.add(value);
            });
        }
    };

    const toggleType = () => {
        const newType = filterType === 'in' ? 'all' : 'in';
        setFilter(d => {
            d.type = newType;
        });
    };

    return (
        <div class={cc(_class, 'fs', {'laggy!fs': isLagging})}>
            <div class="fs_depo">
                <span class="fs_name">{humanName}</span>
                {total > 0 && <span class="fs_total">({total})</span>}
                {isLagging && <Spinny class="fs_spinny" />}
                <div class="fs_spacer" />
                {
                    filterType && showSwitch && (
                        <div class="fs_switch">
                            <button
                                class="fs_switchbutton"
                                onClick={toggleType}
                            >
                                {filterType === 'in' ? 'or' : 'and'}
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
                                        checked={selected.has(f.value)}
                                        onClick={() => toggle(f.value)}
                                    />
                                    {valueTransformFunc(f.value)}
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