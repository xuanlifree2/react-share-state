import { useCallback, useState, useRef, useContext, createContext, useEffect } from 'react';
import { Subject, identity } from 'rxjs';
import { filter, scan, startWith } from 'rxjs/operators';

const subscribeState = (subject$, id, cb, initValue) =>
  subject$
    .pipe(
      filter(({ id: key }) => key === id),
      // support function value as react setState: setSate(n=>n+1)
      scan(([, prev], { value }) => [prev, typeof value === 'function' ? value(prev) : value], [undefined, initValue])
      // startWith([undefined, initValue])
    )
    .subscribe(([, current]) => cb?.(current));

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
    const sub = subscribeState(subject$, id, setState, initValue);
    return () => sub.unsubscribe();
  }, [id, subject$]);
  return state;
};

// callback for data change
export const useGetCallback = (id, cb) => {
  const subject$ = useContext(Context);

  useEffect(() => {
    const sub = subscribeState(subject$, id, cb);
    return () => sub?.unsubscribe();
  }, [id, subject$, cb]);
};

// NOTE: this hooks will not cause rerender even data changed
export const useGetRef = (id, initValue) => {
  const subject$ = useContext(Context);
  const stateRef = useRef(initValue);

  useEffect(() => {
    const sub = subscribeState(
      subject$,
      id,
      (v) => {
        stateRef.current = v;
      },
      initValue
    );
    return () => sub?.unsubscribe();
  }, [id, subject$]);

  return stateRef;
};
