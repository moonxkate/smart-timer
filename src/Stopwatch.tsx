import { useState, useEffect, useRef } from "react";
import "./App.css";

interface StopwatchProps {
  onGoHome?: () => void;
}

const Stopwatch = ({ onGoHome }: StopwatchProps) => {
  const [seconds, setSeconds] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const intervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const elapsedTimeBeforePauseRef = useRef<number>(0);

  useEffect(() => {
    if (isActive) {
      startTimeRef.current = Date.now();

      intervalRef.current = window.setInterval(() => {
        const elapsedTime = (Date.now() - startTimeRef.current) / 1000;
        setSeconds(Math.floor(elapsedTimeBeforePauseRef.current + elapsedTime));
      }, 500);
    }

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive]);

  const toggle = () => {
    if (isActive) {
      elapsedTimeBeforePauseRef.current = seconds;
    }
    setIsActive((prev) => !prev);
  };

  const reset = () => {
    setIsActive(false);
    setSeconds(0);
    elapsedTimeBeforePauseRef.current = 0;
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="timer-page">
      <h2>Stopwatch</h2>
      <div className="timer-display">
        <h1>{formatTime(seconds)}</h1>
      </div>

      <div className="controls">
        <button onClick={toggle}>{isActive ? "Pause" : "Start"}</button>
        <button onClick={reset}>Reset</button>
        {onGoHome && <button onClick={onGoHome}>Home</button>}
      </div>
    </div>
  );
};

export default Stopwatch;
