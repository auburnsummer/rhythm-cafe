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

    // // The ref object is a generic container whose current property is mutable ...
    // // ... and can hold any value, similar to an instance property on a class
    // const ref = useRef();
  
    // // Store current value in ref
    // useEffect(() => {
    //   ref.current = value;
    // }, [value]); // Only re-run if value changes
  
    // // Return previous value (happens before update in useEffect above)
    // return ref.current;
  }