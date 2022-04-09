// https://github.com/streamich/react-use/blob/master/src/usePrevious.ts
import { useCallback, useEffect, useRef } from 'preact/hooks';

export default function usePrevious<T>(state: T): [T | undefined, () => void] {
  const ref = useRef<T>();

  useEffect(() => {
    if (state !== undefined) {
        ref.current = state;
    }
  });

  const reset = useCallback(() => {
    ref.current = undefined;
  }, []);

  return [ref.current, reset];
}
