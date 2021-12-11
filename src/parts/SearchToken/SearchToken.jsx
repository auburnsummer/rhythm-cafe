import cc from "clsx";

import "./SearchToken.css";

import {useSelect} from 'downshift';
import { useLayoutEffect, useMemo, useRef, useState } from "preact/hooks";

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

function InputThatGrows({"class": _class, ...rest}) {
    const value = rest.value;
    const ref = useRef();
    const [width, setWidth] = useState(0);

    useLayoutEffect(() => {
        setWidth(ref.current.getBoundingClientRect().width);
    }, [value]);

    return (
        <div class={cc(_class, "ig")}>
            <span class="ig_invisible" ref={ref}>{value}</span>
            <input class="ig_input" {...rest} style={{width: `calc(${width}px + 1rem)`}}/>
        </div>
    )
}

/**
 * @typedef SearchTokenProps
 * @property {string?} class
 * @property {'select'} [valueType]
 * @property {string} label
 * @property {boolean} hideType
 * @property {import('downshift').UseSelectProps<any>} typeDownshiftArgs
 * @property {any} valueArgs
 * @property {() => void} onClose
 */

/** @param {SearchTokenProps} */
export function SearchToken({"class": _class, label, valueType, hideType, typeDownshiftArgs, valueArgs, onClose}) {

    return (
        <div class={cc(_class, "st")}>
            <div class="st_param">
                <span>{label}</span>
            </div>
            <button class="st_close" onClick={onClose}>
                <i class="fad fa-times-circle fa-swap-opacity"></i>
            </button>
            <div class="st_sep" />
            {  
                !hideType && (
                    <>
                        <SelectDropdown class="st_type" downshiftArgs={typeDownshiftArgs} />
                        <div class="st_sep" />
                    </>
                )
            }
            {
                valueType === 'number' && (
                    <input class="st_value-input" type="number" {...valueArgs} /> 
                )
            }
            {
                valueType === 'text' && (
                    <InputThatGrows class="st_input-wrapper" {...valueArgs} />
                    // <div class="st_input-wrapper">
                    //     <span class="st_input-hide">{valueArgs.value}</span>
                    //     <input class="st_value-input st_input-text" type="text" {...valueArgs} />
                    // </div>
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