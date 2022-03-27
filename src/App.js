import './styles.css';
import { StateProvider } from './state';
import Child1 from './component1';
import Child2 from './component2';
import { range } from 'ramda';

export default function App() {
  return (
    <StateProvider>
      <Child1 />
      <Child2 />
    </StateProvider>
  );
}
