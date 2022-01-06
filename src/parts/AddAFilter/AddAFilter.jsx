import "./AddAFilter.css";
import { useContext } from "preact/hooks";
import { SearchContext } from "..";
import { Menu } from "@headlessui/react";
import cc from "clsx";
import { usePreference } from "../../hooks/usePreference";

/**
 * @typedef AddAFilterProps
 * @param {string?} class 
 */

export function AddAFilter({"class": _class}) {
    const [ , dispatch] = useContext(SearchContext);

    const [showAdvancedFilters] = usePreference("showAdvancedFilters");

    const add = value => dispatch({type: "add", value});

    const data = [
        {
            label: "Difficulty",
            f: () => add({type: "exact", param: "difficulty", value: 1})
        },
        {
            label: "BPM",
            f: () => add({type: "gte", param: "max_bpm", value: 100})
        },
        {
            label: "Single player",
            f: () => add({type: "exact", param: "single_player", value: 1})

        },
        {
            label: "Two player",
            f: () => add({type: "exact", param: "two_player", value: 1})
        },
        {
            label: "With tag…",
            f: () => add({type: "arraycontains", param: "tags", value: ""})

        },
        {
            label: "By author…",
            f: () => add({type: "arraycontains", param: "authors", value: ""})
        },
        ...showAdvancedFilters
            ? [{
                label: "Approval level...",
                f: () => add({type: "gte", param: "approval", value: 10})
            }]
            : []
    ];

    return (
        <Menu as="div" className={cc("af", _class)}>
            <Menu.Button className="af_button">
                <i class="fas fa-filter"></i>
            </Menu.Button>
            <Menu.Items className="af_list">
                <span class="af_message">add a filter to the search</span>
                {
                    data.map(s => (
                        <Menu.Item>
                            {({active}) => (
                                <button
                                    onClick={s.f}
                                    class={cc("af_item", {"active!af_item": active})}
                                >
                                    {s.label}
                                </button>
                            )}
                        </Menu.Item>
                    ))
                }
            </Menu.Items>
        </Menu>
    )
}