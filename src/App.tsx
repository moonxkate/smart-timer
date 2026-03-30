import { useState, useEffect, useRef } from "react";
import "./App.css";

const Timer = () => {
  const [seconds, setSeconds] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const intervalRef = useRef<number | null>(null);

  type Mode = "stopwatch" | "countdown";
  const [mode, setMode] = useState<Mode>("countdown");
  const [inputMinutes, setInputMinutes] = useState<number | "">(1);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = window.setInterval(() => {
        setSeconds((prev) => {
          if (mode === "stopwatch") {
            return prev + 1;
          } else {
            if (prev <= 1) {
              if (intervalRef.current !== null) {
                clearInterval(intervalRef.current);
              }
              setIsActive(false);
              return 0;
            }
            return prev - 1;
          }
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, mode]);

  const toggle = () => setIsActive((prev) => !prev);

  const reset = () => {
    setIsActive(false);
    setSeconds(0);
  };

  useEffect(() => {
    reset();
  }, [mode]);

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const formatTime = (value: number) => value.toString().padStart(2, "0");

  const startCountdown = () => {
    if (inputMinutes !== "" && inputMinutes > 0) {
      setSeconds(inputMinutes * 60);
      setIsActive(true);
    }
  };

  const isTimerRunning =
    mode === "stopwatch" || (mode === "countdown" && seconds > 0);

  return (
    <div>
      <h1>
        {formatTime(minutes)}:{formatTime(remainingSeconds)}
      </h1>
      <button onClick={() => setMode("stopwatch")}>Stopwatch</button>
      <button onClick={() => setMode("countdown")}>Countdown</button>

      {mode === "countdown" && seconds === 0 && (
        <div>
          <input
            type="number"
            value={inputMinutes}
            onChange={(e) => {
              const val = e.target.value;
              setInputMinutes(val === "" ? "" : Number(val));
            }}
          />
          <button onClick={startCountdown}>Start</button>
        </div>
      )}

      {isTimerRunning && (
        <>
          <button onClick={toggle}>{isActive ? "Pause" : "Start"}</button>
          <button onClick={reset}>Reset</button>
        </>
      )}
    </div>
  );
};

export default Timer;
