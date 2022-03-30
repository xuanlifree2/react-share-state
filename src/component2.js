import { useEffect, useState } from 'react';
import { useSet, useGet, useSub } from './state';

export default () => {
  const setB = useSet('b');
  const subB = useSub('b');
  const getA = useGet('a');
  const getC = useGet('c');
  const [stateB, setStateB] = useState(0);
  useEffect(() => subB(setStateB), [subB]);
  return (
    <div>
      <button
        onClick={() => {
          setB((n) => (n ?? 0) + 1);
        }}
      >
        change state b
      </button>
      <div>from a: {getA()}</div>
      <div>from b: {stateB}</div>
      <div>from c: {getC()}</div>
    </div>
  );
};
