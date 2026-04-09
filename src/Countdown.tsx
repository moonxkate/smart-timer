import { useState, useEffect, useRef } from "react";

type CountdownState = "inactive" | "running" | "paused" | "finished";

interface CountdownProps {
  onGoHome?: () => void;
}

const Countdown = ({ onGoHome }: CountdownProps) => {
  const [seconds, setSeconds] = useState<number>(0);
  const [status, setStatus] = useState<CountdownState>("inactive");
  const intervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const totalSecondsRef = useRef<number>(0);
  const pausedSecondsRef = useRef<number>(0);
  const [inputMinutes, setInputMinutes] = useState<number | "">(1);
  const [lastDuration, setLastDuration] = useState<number>(1);
  const [notificationGranted, setNotificationGranted] = useState<boolean>(
    typeof Notification !== "undefined" && Notification.permission === "granted"
  );

  useEffect(() => {
    if (status === "running") {
      startTimeRef.current = Date.now();

      intervalRef.current = window.setInterval(() => {
        const elapsedTime = (Date.now() - startTimeRef.current!) / 1000;
        const remainingTime = Math.floor(totalSecondsRef.current - elapsedTime);

        if (remainingTime <= 0) {
          setSeconds(0);
          setStatus("finished");
        } else {
          setSeconds(remainingTime);
        }
      }, 500);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [status]);

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
      const audio = new Audio("/mixkit-clear-announce-tones-2861.wav");
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
      const totalSeconds = inputMinutes * 60;
      totalSecondsRef.current = totalSeconds;
      setSeconds(totalSeconds);
      setLastDuration(inputMinutes);
      setStatus("running");
    }
  };

  const toggle = () => {
    if (status === "running") {
      pausedSecondsRef.current = seconds;
      setStatus("paused");
    } else {
      totalSecondsRef.current = pausedSecondsRef.current;
      startTimeRef.current = Date.now();
      setStatus("running");
    }
  };

  const restart = () => {
    totalSecondsRef.current = lastDuration * 60;
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
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center gap-8">
      <h1 className="text-4xl font-medium tracking-widest text-neutral-900 uppercase">
        Countdown
      </h1>

      {status === "finished" ? (
        <div className="finished">
          <h2 className="text-8xl font-light tracking-wider uppercase text-neutral-800 pb-8">
            Completed
          </h2>
          <div className="flex flex-row justify-center gap-3">
            <button
              onClick={restart}
              className="w-28 py-3 border border-neutral-200 rounded-lg text-neutral-700 tracking-widest text-lg uppercase hover:border-neutral-400 hover:text-neutral-900 transition-colors"
            >
              Restart
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
      ) : (
        <>
          <h1 className="text-9xl font-light text-neutral-800">
            {formatTime(seconds)}
          </h1>

          {status === "inactive" ? (
            <div className="flex flex-col justify-center gap-5">
              <div className="flex flex-col items-center justify-center gap-1">
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
                  className="w-24 py-2 text-center border border-neutral-200 rounded-lg text-neutral-800 text-lg bg-transparent focus:outline-none focus:border-neutral-400"
                />
                {Number(inputMinutes) > 90 && (
                  <small className="w-24 text-xs text-red-500 text-center px-1">
                    Maximum is 90 minutes
                  </small>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={startCountdown}
                  className="w-28 py-2 border border-neutral-200 rounded-lg text-neutral-700 tracking-widest uppercase hover:border-neutral-400 hover:text-neutral-900 transition-colors"
                >
                  Start
                </button>
                <button
                  onClick={requestNotificationPermission}
                  disabled={notificationGranted}
                  className="w-40 py-2 border border-neutral-200 rounded-lg text-neutral-700 tracking-widest uppercase hover:border-neutral-400 hover:text-neutral-900 transition-colors"
                >
                  {notificationGranted
                    ? "Notifications enabled"
                    : "Enable notifications"}
                </button>
                {onGoHome && (
                  <button
                    onClick={onGoHome}
                    className="w-28 py-2 border border-neutral-200 rounded-lg text-neutral-700 tracking-widest uppercase hover:border-neutral-400 hover:text-neutral-900 transition-colors"
                  >
                    Home
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={toggle}
                className="w-28 py-2 border border-neutral-200 rounded-lg text-neutral-700 tracking-widest uppercase hover:border-neutral-400 hover:text-neutral-900 transition-colors"
              >
                {status === "running" ? "Pause" : "Resume"}
              </button>
              <button
                onClick={reset}
                className="w-28 py-2 border border-neutral-200 rounded-lg text-neutral-700 tracking-widest uppercase hover:border-neutral-400 hover:text-neutral-900 transition-colors"
              >
                Reset
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Countdown;
