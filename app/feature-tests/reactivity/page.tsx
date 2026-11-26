import { SignalCounter, StateCounter } from './signal-counter';

export default function ReactivityPage() {
  return (
    <div className="space-y-4 px-6 py-5">
      <h1 className="text-xl font-semibold">reactivity</h1>
      <SignalCounter />
      <StateCounter />
    </div>
  );
}
