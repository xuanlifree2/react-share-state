import { useSub, useSet, useGet } from './state';
import { useEffect, useState } from 'react';

export default () => {
  const [state, setState] = useState([0, 0]);
  const setC = useSet('c');
  const subC = useSub('c');
  const getA = useGet('a');
  const getB = useGet('b');
  useEffect(() => subC((prev, current) => setState([prev, current]), { prev: true }), [subC]);

  return (
    <div>
      <button
        onClick={() => {
          setC((n) => (n ?? 0) + 1);
        }}
      >
        change state c
      </button>
      <div>from a: {getA()}</div>
      <div>from b: {getB()}</div>
      <div>
        from c: {state[0]} {state[1]}
      </div>
    </div>
  );
};
