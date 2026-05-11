import type { Session } from "./App";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface HistoryProps {
  sessions: Session[];
  onClear: () => void;
}

const formatDuration = (seconds: number) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  if (hrs > 0) return `${hrs}h ${mins}m`;
  return `${mins}m`;
};

const History = ({ sessions, onClear }: HistoryProps) => {
  if (sessions.length === 0) return null;

  const byDay = sessions.reduce((acc, session) => {
    const existing = acc.find((item) => item.date === session.date);
    if (existing) {
      existing.minutes += Math.round(session.duration / 60);
    } else {
      acc.push({
        date: session.date,
        minutes: Math.round(session.duration / 60),
      });
    }
    return acc;
  }, [] as { date: string; minutes: number }[]);

  const chartData = [...byDay].reverse();

  return (
    <div className="w-full max-w-lg mt-4 flex flex-col gap-6">
      <h2 className="text-lg font-medium tracking-widest text-neutral-900 uppercase text-center">
        History
      </h2>

      <ResponsiveContainer width="100%" height={byDay.length * 48 + 40}>
        <BarChart
          layout="vertical"
          data={chartData}
          margin={{ top: 0, right: 40, left: 10, bottom: 0 }}
        >
          <XAxis type="number" unit="m" tick={{ fontSize: 12 }} />
          <YAxis
            type="category"
            dataKey="date"
            tick={{ fontSize: 12 }}
            width={80}
          />
          <Tooltip formatter={(value) => [`${value} min`, "Duration"]} />
          <Bar dataKey="minutes" fill="#404040" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>

      <div className="flex flex-col gap-2">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="flex justify-between text-sm text-neutral-600 border-b border-neutral-100 pb-2"
          >
            <span>{session.date}</span>
            <span>{formatDuration(session.duration)}</span>
          </div>
        ))}
      </div>

      <button
        onClick={onClear}
        className="self-center py-2 px-6 border border-neutral-200 rounded-lg text-neutral-500 tracking-widest text-sm uppercase hover:border-neutral-400 hover:text-neutral-900 transition-colors"
      >
        Clear history
      </button>
    </div>
  );
};

export default History;
