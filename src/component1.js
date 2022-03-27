import { useGetState, useSetState, useGetRef } from './state';

export default () => {
  const set = useSetState('a');
  const state = useGetState('a', 0);
  const statB = useGetRef('b', 0);
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
      <div>from b: {statB.current}</div>
    </div>
  );
};
