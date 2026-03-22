"use client";

import { useState, useEffect } from "react";

interface DynamicCodingTimeProps {
  initialHours: number;
  initialMinutes: number;
  initialTotalSeconds: number;
}

export function DynamicCodingTime({ initialHours, initialMinutes, initialTotalSeconds }: DynamicCodingTimeProps) {
  const [seconds, setSeconds] = useState(initialTotalSeconds);

  useEffect(() => {
    // Tick every second to feel "Live"
    const interval = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  return (
    <div className="glass rounded-xl p-6 flex flex-col gap-1 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <span className="material-symbols-outlined text-5xl">schedule</span>
      </div>
      <p className="text-slate-400 text-sm font-medium">Daily Coding Time</p>
      <div className="flex items-baseline gap-2">
        <h3 className="text-3xl font-bold text-white">{hours}h {minutes}m</h3>
        <span className="text-pulse-green text-sm font-bold flex items-center">Live</span>
      </div>
      <div className="mt-4 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
        <div className="h-full bg-pulse-green w-[100%] rounded-full glow-shadow animate-pulse"></div>
      </div>
    </div>
  );
}
