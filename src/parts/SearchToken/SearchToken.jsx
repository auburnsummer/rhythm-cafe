import cc from "clsx";

import "./SearchToken.css";

import {useSelect} from 'downshift'

export function SelectDropdown({"class": _class, downshiftReturnValue, downshiftArgs}) {
    const {
        getToggleButtonProps,
        isOpen,
        selectedItem,
        selectedIndex,
        getMenuProps,
        getItemProps
    } = downshiftReturnValue;
    const {items, itemToString} = downshiftArgs;

    return (
        <div class={cc("sd", _class)}>
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
                            class={cc("sd_option", {"selected!sd_option": selectedIndex === index})}
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

    const {items: valueDsItems, itemToString: valueDsFunc } = valueDownshiftArgs;
    const {items: typeDsItems, itemToString: typeDsFunc} = typeDownshiftArgs;

    return (
        <div class={cc(_class, "st")}>
            <div class="st_param">
                <span>{label}</span>
            </div>
            <div class="st_sep" />
            <SelectDropdown class="st_type" downshiftReturnValue={typeDs} downshiftArgs={typeDownshiftArgs} />
            {/* <div class="st_type">
                <button class="st_type-button" {...typeDs.getToggleButtonProps()}>
                    <span>{typeDsFunc(typeDs.selectedItem)}</span>
                </button>
                <ul
                    class={cc("st_options", {"visible!st_options": typeDs.isOpen})}
                    {...typeDs.getMenuProps()}
                >
                    {
                       typeDsItems.map((item, index) => (
                            <li
                                class={cc("st_option", {"selected!st_option": typeDs.highlightedIndex === index})}
                                {...typeDs.getItemProps({item, index})}
                            >
                                {typeDsFunc(item)}
                            </li>
                        ))
                    }
                </ul>
            </div> */}
            <div class="st_sep" />
            <div class="st_value">
                <button class="st_value-button" {...valueDs.getToggleButtonProps()}>
                    <span>{valueDsFunc(valueDs.selectedItem)}</span>
                </button>
                <ul
                    class={cc("st_options", {"visible!st_options": valueDs.isOpen})}
                    {...valueDs.getMenuProps()}
                >
                    {
                        valueDsItems.map((item, index) => (
                            <li
                                class={cc("st_option", {"selected!st_option": valueDs.highlightedIndex === index})}
                                {...valueDs.getItemProps({item, index})}
                            >
                                {valueDsFunc(item)}
                            </li>
                        ))
                    }
                </ul>
            </div>
        </div>
    )
}