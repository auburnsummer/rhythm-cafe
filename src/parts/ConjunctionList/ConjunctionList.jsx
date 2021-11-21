import cc from "clsx";
import { useMemo } from "preact/hooks";

import "./ConjunctionList.css"

/**
 * @typedef ConjunctionListProps
 * @property {string?} class
 * @property {string[]} children
 * @property {(v: string) => JSX.Element} elementRender
 * @property {(v: string) => JSX.Element} literalRender
 */

const formatter = new Intl.ListFormat('en', { style: 'short', type: 'conjunction' });

/** @param {ConjunctionListProps} */
export function ConjunctionList({
        "class": _class,
        children,
        elementRender,
        literalRender
    }) {

    const fragments = useMemo(() => {
        /** @type {{type: 'element' | 'literal', value: string}[]} */
        const formatted = formatter.formatToParts(children);
        return formatted;
    }, [children]);

    return (
        <ul class={cc(_class, "cl")}>
            {
                fragments.map(f => (
                    <li class="cl_item">
                        {
                            f.type === 'element'
                                ? elementRender(f.value)
                                : literalRender(f.value)
                        }
                    </li>
                ))
            }
        </ul>
    )
}