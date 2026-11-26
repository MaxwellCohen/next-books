import { CounterIsland } from './counter-island';
import { StaticPanel } from './static-panel';

export default function IslandsPage() {
  return (
    <div className="space-y-4 px-6 py-5">
      <h1 className="text-xl font-semibold">islands</h1>
      <StaticPanel />
      <CounterIsland />
    </div>
  );
}
