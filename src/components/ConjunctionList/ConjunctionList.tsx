import { WithClass } from '@orchard/utils/types';
import cc from 'clsx';
import { JSX } from 'preact';
import { useMemo } from 'preact/hooks';

import './ConjunctionList.css';

const formatter = new Intl.ListFormat('en', { style: 'short', type: 'conjunction' });

type ConjunctionListProps = {
    children: string[];
    elementRender: (v: Intl.ElementPartition['value']) => JSX.Element;
    literalRender: (v: Intl.LiteralPartition['value']) => JSX.Element;
} & WithClass;

export function ConjunctionList({
    'class': _class,
    children,
    elementRender,
    literalRender
}: ConjunctionListProps) {

    const fragments = useMemo(() => {
        const formatted = formatter.formatToParts(children);
        return formatted;
    }, [children]);

    return (
        <ul class={cc(_class, 'cl')}>
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
    );
}