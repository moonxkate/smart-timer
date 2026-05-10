import { useState } from "react";
import { useEffect } from "react";
import Stopwatch from "./Stopwatch";
import Countdown from "./Countdown";
import History from "./History";

type Mode = "home" | "stopwatch" | "countdown";

export interface Session {
  id: string;
  date: string;
  duration: number;
}

const App = () => {
  const [mode, setMode] = useState<Mode>("home");
  const [sessions, setSessions] = useState<Session[]>(() => {
    const saved = localStorage.getItem("timer-sessions");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("timer-sessions", JSON.stringify(sessions));
  }, [sessions]);

  const addSession = (duration: number) => {
    if (duration < 1) return;
    const newSession: Session = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString("en-EN"),
      duration,
    };
    setSessions((prev) => [newSession, ...prev]);
  };

  const clearHistory = () => setSessions([]);

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
          <History sessions={sessions} onClear={clearHistory} />
        </div>
      )}
      {mode === "stopwatch" && (
        <Stopwatch
          onGoHome={() => setMode("home")}
          onSaveSession={(duration) => addSession(duration)}
        />
      )}
      {mode === "countdown" && (
        <Countdown
          onGoHome={() => setMode("home")}
          onSaveSession={(duration) => addSession(duration)}
        />
      )}
    </div>
  );
};

export default App;
