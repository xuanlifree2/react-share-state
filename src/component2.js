import { useSetState, useGetState, useGetRef } from './state';

export default () => {
  const set = useSetState('b');
  const state = useGetState('b', 0);
  const stateA = useGetRef('a', 0);
  return (
    <div>
      <button
        onClick={() => {
          set((n) => n + 1);
        }}
      >
        change state
      </button>
      <span>{state}</span>
      <div>from a: {stateA.current}</div>
    </div>
  );
};
