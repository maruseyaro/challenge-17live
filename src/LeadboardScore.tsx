import { memo, useEffect, useRef, useState } from "react";
import styled from "styled-components";

// How many steps to update between the difference
// Example: from 0 to 200, we update the value 10 times
let STEPS = 20;

// how often we apply each step
let INTERVAL = 30;

const Score = memo(({ value }: { value: number }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const prevValue = useRef(value);
  const intervalRef = useRef(-1);

  useEffect(() => {
    const prev = prevValue.current;
    const totalDiff = value - prev;
    const stepIncrement = Math.ceil(totalDiff / STEPS);

    prevValue.current = prev;

    // if there's a new value reset the display value to it
    // don't wait until it reaches it step by step
    setDisplayValue(prev);

    intervalRef.current = window.setInterval(() => {
      setDisplayValue((prevDisplayValue) => {
        const newDisplayValue = prevDisplayValue + stepIncrement;

        // if we overflow, return the passed value from props
        // we should also clear the interval, this is done in
        // another effect
        if (newDisplayValue >= value) {
          return value;
        }

        return newDisplayValue;
      });
    }, INTERVAL);

    return () => {
      window.clearInterval(intervalRef.current);
    };
  }, [value]);

  // clear the interval if the display value
  // reached the value, because there's no
  // point in continuing
  useEffect(() => {
    if (value === displayValue) {
      window.clearInterval(intervalRef.current);
    }
  }, [value, displayValue]);

  return <Mono>{displayValue}pt</Mono>;
});

// avoid weird alignment in scores with monospace
const Mono = styled.span`
  font-family: monospace;
  font-size: 16px;
  font-weight: 700;
`;

export default Score;
