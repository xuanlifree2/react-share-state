import './styles.css';
import { StateProvider } from './state';
import Child1 from './component1';
import Child2 from './component2';
import Child3 from './component3';
import Child4 from './component4';

export default function App() {
  return (
    <StateProvider>
      <Child1 />
      <Child2 />
      <Child3 />
      <Child4 />
    </StateProvider>
  );
}
