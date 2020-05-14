import { useState, useEffect, useRef, useCallback } from "react";

export function useDidUpdateEffect(fn, inputs) {
    const didMountRef = useRef(false);
  
    useEffect(() => {
      if (didMountRef.current)
        fn();
      else
        didMountRef.current = true;
    }, inputs);
}

export function useForceUpdate() {
    const [, setTick] = useState(0);
    const update = useCallback(() => {
      setTick(tick => tick + 1);
    }, []);
    return update;
}
