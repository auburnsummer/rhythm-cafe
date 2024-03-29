import './Preferences.css';

import cc from 'clsx';
import type { WithClass } from '@orchard/utils/types';
import { ChevronDown, CogOutline, Key, Pager, PrescriptionBottle, Search, Template } from '@orchard/icons';
import { useRef, useState } from 'preact/hooks';
import { useClickAway } from '@orchard/hooks/useClickAway';
import { usePreference } from '@orchard/store';
import { CloudDownload } from '@orchard/icons/CloudDownload';

type PreferenceSelectProps = JSX.HTMLAttributes<HTMLSelectElement>
function PreferenceSelect({ children, ...props }: PreferenceSelectProps) {
    return (
        <div class="pr_selectbox">
            <select class="pr_select" {...props}>
                {children}
            </select>
            <ChevronDown class="pr_selectbox_icon"/>
        </div>
    );
}

type PreferencesProps = WithClass;
export function Preferences({ 'class': _class } : PreferencesProps) {
    const panelRef = useRef<HTMLDivElement>(null);
    const [expanded, setExpanded] = useState(false);
 
    const onClick = (_: Event) => {
        setExpanded(prev => !prev);
    };

    const onMouseDown = (e: Event) => {
        e.stopPropagation();
    };

    useClickAway(panelRef, _ => {
        setExpanded(false);
    });

    const [levelsPerPage, setLevelsPerPage] = usePreference('levels per page');
    const [advancedFilters, setAdvancedFilters] = usePreference('show advanced filters');
    const [levelDetails, setLevelDetails] = usePreference('show more level details');
    const [rowView, setRowView] = usePreference('row view');
    const [liveSearch, setLiveSearch] = usePreference('search as you type');
    const [exactSearch, setExactSearch] = usePreference('exact search');
    const [forceCodex, setForceCodex] = usePreference('force codex urls');

    return (
        <div class={cc(_class, 'pr')}>
            <button
                class={cc(_class, 'pr_button')}
                onClick={onClick}
                onMouseDown={onMouseDown}
            >
                <CogOutline class="pr_bicon" />
            </button>

            <div class={cc('pr_panel', { 'showing!pr_panel': expanded })} ref={panelRef}>
                <ul class="pr_list">
                    <li class="pr_row">
                        <Template class="pr_icon" />
                        <div class="pr_textline">
                            <span>Display levels as</span>
                            <PreferenceSelect
                                value={`${rowView}`}
                                onChange={e => setRowView(e.currentTarget.value === 'true')}
                            >
                                <option value="false">cards</option>
                                <option value="true">rows</option>
                            </PreferenceSelect>
                        </div>
                    </li>
                    <li class="pr_row">
                        <Pager class="pr_icon" />
                        <div class="pr_textline">
                            <span>Show</span>
                            <PreferenceSelect
                                value={levelsPerPage}
                                onChange={e => setLevelsPerPage(Number.parseInt(e.currentTarget.value))}
                            >
                                <option value={15}>15</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                                <option value={120}>120</option>
                            </PreferenceSelect>
                            <span>levels per page</span>
                        </div>
                    </li>
                    <li class="pr_row">
                        <Search class="pr_icon" />
                        <div class="pr_textline">
                            <span>Search style:</span>
                            <PreferenceSelect
                                value={`${liveSearch}`}
                                onChange={e => setLiveSearch(e.currentTarget.value === 'true')}
                            >
                                <option value="false">with a button</option>
                                <option value="true">as I type</option>
                            </PreferenceSelect>
                        </div>
                    </li>                   
                    <li class="pr_row">
                        <Key class="pr_icon" />
                        <div class="pr_textline">
                            <PreferenceSelect
                                value={`${advancedFilters}`}
                                onChange={e => setAdvancedFilters(e.currentTarget.value === 'true')}
                            >
                                <option value="false">Hide</option>
                                <option value="true">Show</option>
                            </PreferenceSelect>
                            <span>advanced filters</span>
                        </div>
                    </li>
                    <li class="pr_row">
                        <PrescriptionBottle class="pr_icon" />
                        <div class="pr_textline">
                            <PreferenceSelect
                                value={`${levelDetails}`}
                                onChange={e => setLevelDetails(e.currentTarget.value === 'true')}
                            >
                                <option value="false">Hide</option>
                                <option value="true">Show</option>
                            </PreferenceSelect>
                            <span>level ids</span>
                        </div>
                    </li>

                    <li class="pr_row">
                        <Search class="pr_icon" />
                        <div class="pr_textline">
                            <span>Show</span>
                            <PreferenceSelect
                                value={`${exactSearch}`}
                                onChange={(e) =>
                                    setExactSearch(e.currentTarget.value === 'true')
                                }
                            >
                                <option value="false">close results</option>
                                <option value="true">only exact results</option>
                            </PreferenceSelect>
                        </div>
                    </li>

                    <li class="pr_row">
                        <CloudDownload class="pr_icon" />
                        <div class="pr_textline">
                            <span>Level URLs from</span>
                            <PreferenceSelect
                                value={`${forceCodex}`}
                                onChange={(e) =>
                                    setForceCodex(e.currentTarget.value === 'true')
                                }
                            >
                                <option value="false">Original source</option>
                                <option value="true">Codex</option>
                            </PreferenceSelect>
                        </div>
                    </li>
                </ul>
                <div class="pr_disclaimer">
                    Note: Settings are saved to a cookie.
                </div>
            </div>
        </div>
    );
}