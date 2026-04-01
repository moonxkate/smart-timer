import { useState, useEffect, useRef } from "react";

const Countdown = () => {
  const [seconds, setSeconds] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const intervalRef = useRef<number | null>(null);
  const [inputMinutes, setInputMinutes] = useState<number | "">(1);

  useEffect(() => {
    if (isActive && seconds > 0) {
      intervalRef.current = window.setInterval(() => {
        setSeconds((prev) => (prev <= 1 ? 0 : prev - 1));
      }, 1000);
    } else if (seconds === 0) {
      setIsActive(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, seconds]);

  const startCountdown = () => {
    if (inputMinutes !== "" && inputMinutes > 0) {
      setSeconds(inputMinutes * 60);
      setIsActive(true);
    }
  };

  const toggle = () => setIsActive((prev) => !prev);

  const reset = () => {
    setIsActive(false);
    setSeconds(0);
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
      <h1>{formatTime(seconds)}</h1>

      {seconds === 0 ? (
        <div className="setup">
          <input
            type="number"
            value={inputMinutes}
            onChange={(e) =>
              setInputMinutes(
                e.target.value === "" ? "" : Number(e.target.value)
              )
            }
          />
          <button onClick={startCountdown}>Start</button>
        </div>
      ) : (
        <div className="controls">
          <button onClick={() => setIsActive(!isActive)}>
            {isActive ? "Pause" : "Resume"}
          </button>
          <button
            onClick={() => {
              setSeconds(0);
              setIsActive(false);
            }}
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
};

export default Countdown;
