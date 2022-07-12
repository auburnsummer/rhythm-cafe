import './App.css';
import { Header } from '@orchard/components/Header';
import { Levels } from '@orchard/components/Levels';
import { useState } from 'preact/hooks';

import cc from 'clsx';
import { Filter } from './icons';

export function App() {
    const [showSidebar, setShowSidebar] = useState(false);

    return (
        <div class="ap">
            <Header class="ap_header" />
            <button class="ap_togglesidebar" onClick={() => setShowSidebar(prev => !prev)}>
                <Filter class="ap_togglesidebaricon" />
            </button>
            <div class="ap_layout">
                <Levels class="ap_levels" />
            </div>
        </div>
    );
}
