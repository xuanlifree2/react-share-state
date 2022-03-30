import './styles.css';
import { StateProvider } from './state';
import Child1 from './component1';
import Child2 from './component2';
import Child3 from './component3';

export default function App() {
  return (
    <StateProvider>
      <Child1 />
      <Child2 />
      <Child3 />
    </StateProvider>
  );
}
