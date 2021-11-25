import { Header, Levels, SearchContextFactory } from "./parts";
import "./App.css";

export function App() {
    return (
        <SearchContextFactory>
            <div class="ap">
                <Header class="ap_header" />
                <Levels />
            </div>
        </SearchContextFactory>
    )
}
