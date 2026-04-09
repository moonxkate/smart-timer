import { useState } from "react";
import Stopwatch from "./Stopwatch";
import Countdown from "./Countdown";

type Mode = "home" | "stopwatch" | "countdown";

const App = () => {
  const [mode, setMode] = useState<Mode>("home");

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
      {mode === "home" && (
        <div className="flex flex-col items-center gap-8">
          <h1 className="text-4xl font-medium tracking-widest text-neutral-900 uppercase">
            Timer
          </h1>
          <div className="flex flex-col gap-2.5 w-48">
            <button
              onClick={() => setMode("stopwatch")}
              className="py-3 border border-neutral-200 rounded-lg text-neutral-700 tracking-widest text-base uppercase hover:border-neutral-900 transition-colors"
            >
              Stopwatch
            </button>
            <button
              onClick={() => setMode("countdown")}
              className="py-3 border border-neutral-200 rounded-lg text-neutral-700 tracking-widest text-base uppercase hover:border-neutral-900 transition-colors"
            >
              Countdown
            </button>
          </div>
        </div>
      )}
      {mode === "stopwatch" && <Stopwatch onGoHome={() => setMode("home")} />}
      {mode === "countdown" && <Countdown onGoHome={() => setMode("home")} />}
    </div>
  );
};

export default App;
