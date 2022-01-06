import { Header, Levels, SearchContextFactory } from "./parts";
import "./App.css";
import { MittContextFactory } from "./parts/MittContext/MittContextFactory";
import { PreferenceContextFactory } from "./parts/PreferenceContext/PreferenceContextFactory";

export function App() {
    return (
        <PreferenceContextFactory>
        <MittContextFactory>
        <SearchContextFactory>
            <div class="ap">
                <Header class="ap_header" />
                <Levels />
            </div>
        </SearchContextFactory>
        </MittContextFactory>
        </PreferenceContextFactory>
    )
}
