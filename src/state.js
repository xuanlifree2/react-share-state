import { useCallback, useState, useRef, useContext, createContext, useEffect } from 'react';
import { Subject } from 'rxjs';
import { filter, scan } from 'rxjs/operators';

const buildState = (subject$, id, initValue) =>
  subject$?.pipe(
    filter(({ id: key }) => key === id),
    // support function value as react setState: setSate(n=>n+1)
    scan(([, prev], { value }) => [prev, typeof value === 'function' ? value(prev) : value], [undefined, initValue]),
    // startWith([undefined, initValue])
  );

const subscribeState = (subject$, id, cb, initValue) =>
  buildState(subject$, id, initValue).subscribe(([prev, current]) => cb?.(prev, current));

const Context = createContext();

export const StateProvider = ({ children }) => {
  // will not recreate when rerender
  const subject$ = useRef(new Subject());
  useEffect(() => () => subject$.current.complete(), []);
  return <Context.Provider value={subject$.current}>{children}</Context.Provider>;
};

export const useSetState = (id) => {
  const subject$ = useContext(Context);
  const setS = useCallback((value) => subject$?.next({ id, value }), [id, subject$]);
  return setS;
};

// id: unique for every state
export const useGetState = (id, initValue) => {
  const subject$ = useContext(Context);
  const [state, setState] = useState(initValue);
  useEffect(() => {
    const sub = subscribeState(subject$, id, (_, current) => setState(current), initValue);
    return () => sub.unsubscribe();
  }, [id, subject$, initValue]);
  return state;
};

// callback for data change with prev, current data
export const useGetCallback = (id, cb) => {
  const subject$ = useContext(Context);
  const effect = useRef();
  effect.current = cb;

  // whenever id changed, we will use latest cb as callback and use ref to avoid put it in dependency
  useEffect(() => {
    const sub = subscribeState(subject$, id, effect.current);
    return () => sub?.unsubscribe();
  }, [id, subject$]);
};

export const useSub = (id) => {
  const subject$ = useContext(Context);

  const sub = useCallback(
    (cb) => {
      return subscribeState(subject$, id, cb);
    },
    [id, subject$],
  );
  // useEffect(() => () => sub(), [sub]);
  return sub;
};

// NOTE: this hooks will not cause rerender even data changed
export const useGetRef = (id, initValue) => {
  const subject$ = useContext(Context);
  const stateRef = useRef(initValue);
  useEffect(() => {
    const sub = subscribeState(
      subject$,
      id,
      (_, current) => {
        stateRef.current = current;
      },
      initValue,
    );
    return () => sub?.unsubscribe();
  }, [id, subject$, initValue]);

  return stateRef;
};
