import { Search } from "@orchard/icons";
import { As, usePreference, useQuery } from "@orchard/store";
import { WithClass } from "@orchard/utils/types";
import cc from "clsx";
import { useEffect, useState } from "preact/hooks";
import "./SearchBar.css";

type SearchBarProps = {} & WithClass;

export function SearchBar({"class": _class}: SearchBarProps) {
    const [q, setQuery] = useQuery();
    const [text, setText] = useState("");
    const [liveSearch] = usePreference("search as you type", As.BOOLEAN);

    const doSearch = () => {
        setQuery(text);
    };

    useEffect(() => {
        setText(q);
    }, [q]);

    return (
        <div class={cc(_class, "se")}>
            <div class="se_bar">
                <input
                    value={text}
                    onInput={evt => setText(evt.currentTarget.value)}
                    class="se_input"
                    placeholder="What do you feel like playing today?"
                />
                <button onClick={doSearch} aria-label="Search" class="se_button">
                    <Search class="se_mag" />
                </button>
            </div>
        </div>
    )
}