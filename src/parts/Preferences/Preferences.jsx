import "./Preferences.css";

import cc from "clsx";
import { Menu, Popover } from "@headlessui/react";
import { usePreference } from "../../hooks/usePreference";

function PreferenceSelect({children, ...props}) {
    return (
        <div class="pr_selectbox">
            <select class="pr_select" {...props}>
                {children}
            </select>
            <i class="fas fa-chevron-down"></i>
        </div>
    )
}

export function Preferences({"class": _class}) {

    const [levelsPerPage, setLevelsPerPage] = usePreference("levelsPerPage");
    const [showAdvancedFilters, setShowAdvancedFilters] = usePreference("showAdvancedFilters");
    const [showMoreLevelDetails, setShowMoreLevelDetails] = usePreference("showMoreLevelDetails");

    return (
        <Popover class={cc(_class, "pr")}>
            <Popover.Button class={cc(_class, "pr_button")}>
                <i class="fas fa-wrench pr_icon"></i>
            </Popover.Button>

            <Popover.Panel class="pr_panel">
                <ul class="pr_list">
                    <li class="pr_row">
                        <i class="fad fa-pager"></i>
                        <div class="pr_textline">
                            <span>Show</span>
                            <PreferenceSelect value={levelsPerPage} onChange={evt => setLevelsPerPage(evt.target.value)}>
                                <option value={15}>15</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                                <option value={99}>99</option>
                            </PreferenceSelect>
                            <span>levels per page</span>
                        </div>
                    </li>
                    <li class="pr_row">
                        <i class="fas fa-key"></i>
                        <div class="pr_textline">
                            <PreferenceSelect value={showAdvancedFilters ? "vtrue" : "vfalse"} onChange={evt => setShowAdvancedFilters(evt.target.value === "vtrue")}>
                                <option value="vfalse">Hide</option>
                                <option value="vtrue">Show</option>
                            </PreferenceSelect>
                            <span>advanced filters</span>
                        </div>
                    </li>
                    <li class="pr_row">
                        <i class="fad fa-prescription-bottle-alt"></i>
                        <div class="pr_textline">
                            <PreferenceSelect value={showMoreLevelDetails ? "vtrue" : "vfalse"} onChange={evt => setShowMoreLevelDetails(evt.target.value === "vtrue")}>
                                <option value="vfalse">Hide</option>
                                <option value="vtrue">Show</option>
                            </PreferenceSelect>
                            <span>level ids</span>
                        </div>
                    </li>
                </ul>
            </Popover.Panel>
        </Popover>
    )
}