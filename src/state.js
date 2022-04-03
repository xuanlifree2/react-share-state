import { createContext, useCallback, useContext, useEffect, useRef } from 'react';
import { Subject, pipe, identity } from 'rxjs';
import { filter, scan } from 'rxjs/operators';

const filterBy = (id) => pipe(filter(({ id: key }) => key === id));

// support function value as react setState: setSate(n=>n+1)
const withPrev = () =>
  pipe(scan(([, prev], { value }) => [prev, typeof value === 'function' ? value(prev) : value], []));

const buildState = (id) => pipe(filterBy(id), withPrev());

const Context = createContext();

export const StateProvider = ({ children }) => {
  // will not recreate when rerender
  const subject$ = useRef(new Subject());
  useEffect(() => () => subject$.current.complete(), []);
  return <Context.Provider value={subject$.current}>{children}</Context.Provider>;
};

export const useStream = (id, initValue, { prev = false } = {}) => {
  const subject$ = useContext(Context);
  return subject$.pipe(filterBy(id), prev ? withPrev() : identity);
};

export const useSet = (id) => {
  const subject$ = useContext(Context);
  return useCallback((value) => subject$?.next({ id, value }), [id, subject$]);
};

export const useGet = (id) => {
  const subject$ = useContext(Context);
  const value = useRef([]);
  useEffect(() => {
    const sub = subject$.pipe(buildState(id)).subscribe((v) => {
      value.current = v;
    });
    return () => sub.unsubscribe();
  }, [id, subject$]);
  return useCallback(({ prev = false } = {}) => {
    const [, current] = value.current;
    return prev ? value.current : current;
  }, []);
};

export const useSub = (id) => {
  const subject$ = useContext(Context);
  return useCallback(
    (cb, { prev = false } = {}) => {
      const s = subject$.pipe(buildState(id)).subscribe(([pre, cur]) => (prev ? cb?.([pre, cur]) : cb?.(cur)));
      return () => s.unsubscribe();
    },
    [id, subject$]
  );
};
