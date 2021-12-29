import { useEffect } from "preact/hooks";


export function usePrevious(value) {
    const [prevs, setPrevs] = useState([]);

    useEffect(() => {
        setPrevs(prev => [...prev, value]);
    }, [value]);

    const clear = () => setPrevs([]);

    return [prevs, clear];
}