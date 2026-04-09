import { useState, useEffect, useRef } from "react";

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
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center gap-8">
      <h1 className="text-4xl font-medium tracking-widest text-neutral-900 uppercase">
        Stopwatch
      </h1>

      <h2 className="text-9xl font-light text-neutral-800">
        {formatTime(seconds)}
      </h2>

      <div className="flex gap-3">
        <button
          onClick={toggle}
          className="w-28 py-3 border border-neutral-200 rounded-lg text-neutral-700 tracking-widest text-lg uppercase hover:border-neutral-400 hover:text-neutral-900 transition-colors"
        >
          {isActive ? "Pause" : "Start"}
        </button>
        <button
          onClick={reset}
          className="w-28 py-3 border border-neutral-200 rounded-lg text-neutral-700 tracking-widest text-lg uppercase hover:border-neutral-400 hover:text-neutral-900 transition-colors"
        >
          Reset
        </button>
        {onGoHome && (
          <button
            onClick={onGoHome}
            className="w-28 py-3 border border-neutral-200 rounded-lg text-neutral-700 tracking-widest text-lg uppercase hover:border-neutral-400 hover:text-neutral-900 transition-colors"
          >
            Home
          </button>
        )}
      </div>
    </div>
  );
};

export default Stopwatch;
