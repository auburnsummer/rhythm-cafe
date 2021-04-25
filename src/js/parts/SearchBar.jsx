import { h } from 'preact';

import "./SearchBar.css";

export function SearchBar() {
    return (
        <div class="sb">
            <form class="sb_bar">
                <input 
                    class="sb_input"
                    placeholder="What do you feel like playing today?"
                >
                </input>
                <button type="button" class="sb_button">
                    <i class="fad fa-search"></i>
                </button>
            </form>
        </div>
    )
}