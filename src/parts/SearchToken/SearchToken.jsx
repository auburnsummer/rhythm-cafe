import cc from "clsx";

import "./SearchToken.css";

import {useSelect} from 'downshift'

export function SelectDropdown({"class": _class, downshiftArgs}) {
    const {
        getToggleButtonProps,
        isOpen,
        selectedItem,
        highlightedIndex,
        getMenuProps,
        getItemProps
    } = useSelect(downshiftArgs);
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
 * @property {'select'} [valueType]
 * @property {string} label
 * @property {import('downshift').UseSelectProps<any>} typeDownshiftArgs
 * @property {any} valueArgs
 * @property {() => void} onClose
 */

/** @param {SearchTokenProps} */
export function SearchToken({"class": _class, label, valueType, typeDownshiftArgs, valueArgs, onClose}) {

    return (
        <div class={cc(_class, "st")}>
            <div class="st_param">
                <span>{label}</span>
            </div>
            <button class="st_close" onClick={onClose}>
                <i class="fad fa-times-circle fa-swap-opacity"></i>
            </button>
            <div class="st_sep" />
            <SelectDropdown class="st_type" downshiftArgs={typeDownshiftArgs} />
            <div class="st_sep" />
            {
                valueType === 'number' && (
                    <input class="st_value-input" type="number" {...valueArgs} /> 
                )
            }
            {
                !valueType && (
                    <SelectDropdown class="st_value" downshiftArgs={valueArgs} />
                )
            }
        </div>
    )
}