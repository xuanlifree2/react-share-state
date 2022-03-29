import { useGetCallback, useSetState } from './state';
import { useState } from 'react';

export default () => {
  const [state, setState] = useState([0, 0]);
  useGetCallback('c', (prev, current) => setState([prev, current]));
  const set = useSetState('c');
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
