import { useState } from "react";
import Stopwatch from "./Stopwatch";
import Countdown from "./Countdown";
import "./App.css";

const App = () => {
  type Mode = "stopwatch" | "countdown";
  const [mode, setMode] = useState<Mode>("countdown");

  return (
    <div className={`app-container ${mode}-mode`}>
      <nav className="tabs">
        <button
          className={mode === "stopwatch" ? "active" : ""}
          onClick={() => setMode("stopwatch")}
        >
          Stopwatch
        </button>
        <button
          className={mode === "countdown" ? "active" : ""}
          onClick={() => setMode("countdown")}
        >
          Countdown
        </button>
      </nav>

      <div className="page-content">
        {mode === "stopwatch" ? <Stopwatch /> : <Countdown />}
      </div>
    </div>
  );
};

export default App;
