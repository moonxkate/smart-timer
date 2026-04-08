import { useState } from "react";
import Stopwatch from "./Stopwatch";
import Countdown from "./Countdown";
import "./App.css";

type Mode = "home" | "stopwatch" | "countdown";

const App = () => {
  const [mode, setMode] = useState<Mode>("home");

  return (
    <div className="page-content">
      {mode === "home" && (
        <div className="home-menu">
          <h1>Timer</h1>
          <button onClick={() => setMode("stopwatch")}>Stopwatch</button>
          <button onClick={() => setMode("countdown")}>Countdown</button>
        </div>
      )}
      {mode === "stopwatch" && <Stopwatch onGoHome={() => setMode("home")} />}
      {mode === "countdown" && <Countdown onGoHome={() => setMode("home")} />}
    </div>
  );
};

export default App;
