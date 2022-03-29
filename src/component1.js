import { useGetState, useSetState, useGetRef } from './state';

export default () => {
  const set = useSetState('a');
  const [prev, current] = useGetState('a', 0, true);
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
      <span>
        {prev} {current}
      </span>
      <div>from b: {statB.current}</div>
    </div>
  );
};
