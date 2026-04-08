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
  const [lastDuration, setLastDuration] = useState<number>(1);
  const [notificationGranted, setNotificationGranted] = useState<boolean>(
    typeof Notification !== undefined && Notification.permission === "granted"
  );

  useEffect(() => {
    if (status === "running" && seconds > 0) {
      intervalRef.current = window.setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    } else if (status === "running" && seconds === 0) {
      setStatus("finished");
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [status, seconds]);

  useEffect(() => {
    if (status === "finished") {
      sendNotification();
    }
  }, [status]);

  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) return;

    const permission = await Notification.requestPermission();
    setNotificationGranted(permission === "granted");
  };

  const sendNotification = () => {
    if (!("Notification" in window)) return;
    if (Notification.permission !== "granted") return;

    setTimeout(() => {
      const audio = new Audio("public/mixkit-clear-announce-tones-2861.wav");
      audio.play();
      new Notification("Countdown complete!", {
        body: "Your timer has finished!",
        tag: "countdown-complete",
        requireInteraction: true,
        silent: true,
      });
    }, 100);
  };

  const startCountdown = () => {
    if (inputMinutes !== "" && inputMinutes > 0 && inputMinutes <= 90) {
      setSeconds(inputMinutes * 60);
      setLastDuration(inputMinutes);
      setStatus("running");
    }
  };

  const toggle = () =>
    setStatus((prev) => (prev === "running" ? "paused" : "running"));

  const restart = () => {
    setSeconds(lastDuration * 60);
    setStatus("running");
  };

  const reset = () => {
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
            <button onClick={reset}>Reset</button>
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
                max={90}
                onChange={(e) =>
                  setInputMinutes(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
              />
              {Number(inputMinutes) > 90 && (
                <small>Maximum is 90 minutes</small>
              )}
              <button onClick={startCountdown}>Start</button>
              <button
                onClick={requestNotificationPermission}
                disabled={notificationGranted}
              >
                {notificationGranted
                  ? "Notifications enabled"
                  : "Enable notifications"}
              </button>
              {onGoHome && <button onClick={onGoHome}>Home</button>}
            </div>
          ) : (
            <div className="controls">
              <button onClick={toggle}>
                {status === "running" ? "Pause" : "Resume"}
              </button>
              <button onClick={reset}>Reset</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Countdown;
