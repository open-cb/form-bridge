import { useEffect, useRef } from 'react';

export default function useTempState<T>(state: T, timeout: number = 1000) {
  const stateRef = useRef<T | undefined>(state);

  if (state !== stateRef.current) {
    stateRef.current = state;
  }

  useEffect(() => {
    if (state === undefined) return;

    setTimeout(() => {
      stateRef.current = undefined;
    }, timeout);
  }, [state, timeout]);

  return stateRef;
}
