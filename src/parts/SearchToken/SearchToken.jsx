import cc from "clsx";

import "./SearchToken.css";

import {useSelect} from 'downshift'

export function SelectDropdown({"class": _class, downshiftReturnValue, downshiftArgs}) {
    const {
        getToggleButtonProps,
        isOpen,
        selectedItem,
        highlightedIndex,
        getMenuProps,
        getItemProps
    } = downshiftReturnValue;
    const {items, itemToString} = downshiftArgs;

    return (
        <div class={cc(_class, "sd")}>
            <button class="sd_button" {...getToggleButtonProps()}>
                <span>{itemToString(selectedItem)}</span>
            </button>
            <ul
                class={cc("sd_options", {"visible!sd_options": isOpen})}
                {...getMenuProps()}
            >
                {
                    items.map((item, index) => (
                        <li
                            class={cc("sd_option", {"selected!sd_option": highlightedIndex === index})}
                            {...getItemProps({item, index})}
                        >
                            {itemToString(item)}
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}

/**
 * @typedef SearchTokenProps
 * @property {string?} class
 * @property {string} label
 * @property {import('downshift').UseSelectProps<any>} typeDownshiftArgs
 * @property {import('downshift').UseSelectProps<any>} valueDownshiftArgs
 */

/** @param {SearchTokenProps} */
export function SearchToken({"class": _class, label, typeDownshiftArgs, valueDownshiftArgs}) {
    const valueDs = useSelect(valueDownshiftArgs);
    const typeDs = useSelect(typeDownshiftArgs);

    return (
        <div class={cc(_class, "st")}>
            <div class="st_param">
                <span>{label}</span>
            </div>
            <div class="st_sep" />
            <SelectDropdown class="st_type" downshiftReturnValue={typeDs} downshiftArgs={typeDownshiftArgs} />
            <div class="st_sep" />
            <SelectDropdown class="st_value" downshiftReturnValue={valueDs} downshiftArgs={valueDownshiftArgs} />
        </div>
    )
}