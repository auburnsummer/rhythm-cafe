import { Header, Levels, SearchContextFactory } from "./parts";
import "./App.css";
import { MittContextFactory } from "./parts/MittContext/MittContextFactory";

export function App() {
    return (
        <MittContextFactory>
        <SearchContextFactory>
            <div class="ap">
                <Header class="ap_header" />
                <Levels />
            </div>
        </SearchContextFactory>
        </MittContextFactory>
    )
}
