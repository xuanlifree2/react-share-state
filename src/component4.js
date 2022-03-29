import { useSub, useSetState } from './state';
import { useEffect, useState } from 'react';

export default () => {
  const [state, setState] = useState([0, 0]);
  const set = useSetState('d');
  const sub = useSub('d');
  useEffect(() => {
    const s = sub((prev, current) => setState([prev, current]));
    return () => s.unsubscribe();
  }, [sub]);

  return (
    <div>
      <button
        onClick={() => {
          set((n) => (n ?? 0) + 1);
        }}
      >
        change state
      </button>
      <span>
        {state[0]} {state[1]}
      </span>
    </div>
  );
};
