import { Search } from '@orchard/icons';
import { usePreference, useQuery } from '@orchard/store';
import type { WithClass } from '@orchard/utils/types';
import { useDebouncedEffect } from '@react-hookz/web/esnext';
import cc from 'clsx';
import { useState } from 'preact/hooks';
import './SearchBar.css';

type SearchBarProps = WithClass;

export function SearchBar({ 'class': _class }: SearchBarProps) {
    const [q, setQuery] = useQuery();
    const [text, setText] = useState(q);
    const [liveSearch] = usePreference('search as you type');

    const doSearch = (e: Event) => {
        e.preventDefault();
        if (!liveSearch) {
            setQuery(text);
        }
    };

    useDebouncedEffect(() => {
        if (liveSearch) {
            setQuery(text);
        }
    },
    [text],
    200,
    500
    );

    return (
        <div class={cc(_class, 'se')}>
            <form class={cc('se_bar', { 'live!se_bar': liveSearch })} onSubmit={doSearch}>
                <input
                    value={text}
                    onInput={evt => setText(evt.currentTarget.value)}
                    class="se_input"
                    placeholder="What do you feel like playing today?"
                />
                <button type="submit" aria-label="Search" class="se_button">
                    <Search class="se_mag" />
                </button>
            </form>
        </div>
    );
}