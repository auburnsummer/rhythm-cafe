import "./Preferences.css";

import cc from "clsx";
import { WithClass } from "@orchard/utils/types";
import { ChevronDown, CogOutline, Key, Pager, PrescriptionBottle } from "@orchard/icons";
import { useRef, useState } from "preact/hooks";
import { useClickAway } from "@orchard/hooks/useClickAway";
import { As, usePreference } from "@orchard/store";

type PreferenceSelectProps = JSX.HTMLAttributes<HTMLSelectElement>
function PreferenceSelect({children, ...props}: PreferenceSelectProps) {
    return (
        <div class="pr_selectbox">
            <select class="pr_select" {...props}>
                {children}
            </select>
            <ChevronDown class="pr_selectbox_icon"/>
        </div>
    )
}

type PreferencesProps = {

} & WithClass;

export function Preferences({"class": _class} : PreferencesProps) {

    const panelRef = useRef<HTMLDivElement>(null);
    const [expanded, setExpanded] = useState(false);

    const onClick = (e: Event) => {
        setExpanded(prev => !prev);
    };

    const onMouseDown = (e: Event) => {
        e.stopPropagation();
        console.log("mouse downnnnnnn");
    };

    useClickAway(panelRef, _ => {
        setExpanded(false);
    });

    const [levelsPerPage, setLevelsPerPage] = usePreference("levels per page", As.NUMBER);
    // const [showAdvancedFilters, setShowAdvancedFilters] = usePreference("showAdvancedFilters");
    // const [showMoreLevelDetails, setShowMoreLevelDetails] = usePreference("showMoreLevelDetails");

    return (
        <div class={cc(_class, "pr")}>
            <button
                class={cc(_class, "pr_button")}
                onClick={onClick}
                onMouseDown={onMouseDown}
            >
                <CogOutline class="pr_bicon" />
            </button>

            <div class={cc("pr_panel", {"showing\!pr_panel": expanded})} ref={panelRef}>
                <ul class="pr_list">
                    <li class="pr_row">
                        <Pager class="pr_icon" />
                        <div class="pr_textline">
                            <span>Show</span>
                            <PreferenceSelect
                                value={levelsPerPage}
                                onChange={e => setLevelsPerPage(e.currentTarget.value)}
                            >
                                <option value={15}>15</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                            </PreferenceSelect>
                            <span>levels per page</span>
                        </div>
                    </li>
                    <li class="pr_row">
                        <Key class="pr_icon" />
                        <div class="pr_textline">
                            <PreferenceSelect>
                                <option value="vfalse">Hide</option>
                                <option value="vtrue">Show</option>
                            </PreferenceSelect>
                            <span>advanced filters</span>
                        </div>
                    </li>
                    <li class="pr_row">
                        <PrescriptionBottle class="pr_icon" />
                        <div class="pr_textline">
                            <PreferenceSelect>
                                <option value="vfalse">Hide</option>
                                <option value="vtrue">Show</option>
                            </PreferenceSelect>
                            <span>level ids</span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    )
}