# react-share-state

## features:

- share state between different components which might be in different nested level
- default store previous state value with `withPrev` option
- useSetSate hooks support function value as react: setState(n => n + 1)
- same shared state has three way to get:
  - useGetState -> change will cause rerender
  - useGetCallback -> change will call callback function
  - useGetRef -> change ref value which will not cause rerender
