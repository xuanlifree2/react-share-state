import { useEffect, useState } from 'react';
import { useGet, useSet, useSub } from './state';

export default () => {
  const setA = useSet('a');
  const subA = useSub('a');
  const getB = useGet('b');
  const getC = useGet('c');
  const [stateA, setStateA] = useState(10);
  useEffect(() => subA(setStateA), [subA]);
  return (
    <div>
      <button
        onClick={() => {
          setA((n) => (n ?? 0) + 1);
        }}
      >
        change state a
      </button>
      <div>from a: {stateA}</div>
      <div>from b: {getB()}</div>
      <div>from c: {getC()}</div>
    </div>
  );
};
