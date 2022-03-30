import { useCallback, useState, useRef, useContext, createContext, useEffect } from 'react';
import { Subject } from 'rxjs';
import { filter, scan } from 'rxjs/operators';

const buildState = (subject$, id, initValue) =>
  subject$?.pipe(
    filter(({ id: key }) => key === id),
    // support function value as react setState: setSate(n=>n+1)
    scan(([, prev], { value }) => [prev, typeof value === 'function' ? value(prev) : value], [undefined, initValue])
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

export const useSet = (id) => {
  const subject$ = useContext(Context);
  const setS = useCallback((value) => subject$?.next({ id, value }), [id, subject$]);
  return setS;
};

export const useGet = (id) => {
  const subject$ = useContext(Context);
  const value = useRef([]);
  useEffect(() => {
    const sub = subscribeState(subject$, id, (prev, current) => {
      value.current = [prev, current];
    });
    return () => sub.unsubscribe();
  }, [id, subject$]);

  return useCallback(({ withPrev = false } = {}) => {
    const [, current] = value.current;
    return withPrev ? value.current : current;
  }, []);
};

export const useSub = (id) => {
  const subject$ = useContext(Context);
  return useCallback(
    (cb, { withPrev = false } = {}) => {
      const s = subscribeState(subject$, id, (prev, current) => (withPrev ? cb?.(prev, current) : cb?.(current)));
      return () => s.unsubscribe();
    },
    [id, subject$]
  );
};
