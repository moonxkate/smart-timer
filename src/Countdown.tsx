import { useState, useEffect, useRef } from "react";

type CountdownState = "inactive" | "running" | "paused" | "finished";

interface CountdownProps {
  onGoHome?: () => void;
}

const Countdown = ({ onGoHome }: CountdownProps) => {
  const [seconds, setSeconds] = useState<number>(0);
  const [status, setStatus] = useState<CountdownState>("inactive");
  const intervalRef = useRef<number | null>(null);
  const [inputMinutes, setInputMinutes] = useState<number | "">(1);

  useEffect(() => {
    if (status === "running" && seconds > 0) {
      intervalRef.current = window.setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setStatus("finished");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [status]);

  const startCountdown = () => {
    if (inputMinutes !== "" && inputMinutes > 0) {
      setSeconds(inputMinutes * 60);
      setStatus("running");
    }
  };

  const toggle = () =>
    setStatus((prev) => (prev === "running" ? "paused" : "running"));

  const restart = () => {
    setSeconds(0);
    setStatus("inactive");
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
      <h2>Countdown</h2>

      {status === "finished" ? (
        <div className="finished">
          <h1>Completed</h1>
          <div className="controls">
            <button onClick={restart}>Restart</button>
            {onGoHome && <button onClick={onGoHome}>Home</button>}
          </div>
        </div>
      ) : (
        <>
          <h1>{formatTime(seconds)}</h1>

          {status === "inactive" ? (
            <div className="setup">
              <input
                type="number"
                value={inputMinutes}
                min={1}
                onChange={(e) =>
                  setInputMinutes(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
              />
              <button onClick={startCountdown}>Start</button>
              {onGoHome && <button onClick={onGoHome}>Home</button>}
            </div>
          ) : (
            <div className="controls">
              <button onClick={toggle}>
                {status === "running" ? "Pause" : "Resume"}
              </button>
              <button onClick={restart}>Reset</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Countdown;
