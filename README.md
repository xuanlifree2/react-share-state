# react-share-state

## features:

- share state between different components which might be in different nested level
- default store previous state value with `withPrev` option
- useSet support function value as react: setState(n => n + 1)

- useSet: 
  - return a function which can set message to shared state
- useGet:
  - return a function which can get latest value of state
- useSub:
  - return a function which can subscribe state change 