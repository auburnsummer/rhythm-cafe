import { useState } from "preact/hooks";

export function usePrevious(initialValue) {
    const [previousValues, setPreviousValues] = useState([]);
    const [currentValue, setCurrentValue] = useState(initialValue);

    const set = value => {
        setPreviousValues(prev => [...prev, currentValue]);
        setCurrentValue(value); 
    }

    const pop = () => {
        setCurrentValue(previousValues.at(-1));
        setPreviousValues(prev => prev.slice(0, -1));
    }

    const clear = () => {
        setPreviousValues([]);
    }

    return [currentValue, previousValues, set, pop, clear];
  }