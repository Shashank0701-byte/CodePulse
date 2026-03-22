"use client";

import { useState, useEffect } from "react";

type PresenceUpdate = {
  userId: string;
  project: string;
  file: string;
  language?: string;
  branch?: string;
  timestamp: number;
  activity?: "high" | "peak" | "mid" | "none";
};

export default function LiveStatus({ userId }: { userId?: string }) {
  const [presence, setPresence] = useState<PresenceUpdate | null>(null);
  const [status, setStatus] = useState<"connecting" | "live" | "offline">("connecting");

  useEffect(() => {
    let eventSource: EventSource | null = null;
    let reconnectTimeout: NodeJS.Timeout | null = null;
    let isUnmounted = false;

    const connect = () => {
      if (typeof window === "undefined" || isUnmounted) return;
      
      const url = userId ? `/api/presence?userId=${userId}` : "/api/presence";
      eventSource = new EventSource(url);

      eventSource.onopen = () => {
        if (!isUnmounted) setStatus("live");
      };

      eventSource.onmessage = (event) => {
        if (isUnmounted) return;
        try {
          const data = JSON.parse(event.data);
          if (data.type === "connected") {
            setStatus("live");
            return;
          }
          setPresence(data);
        } catch (err) {
          console.error("Failed to parse presence data:", err);
        }
      };

      eventSource.onerror = () => {
        if (isUnmounted) return;
        setStatus("offline");
        eventSource?.close();
        reconnectTimeout = setTimeout(connect, 5000);
      };
    };

    connect();

    return () => {
      isUnmounted = true;
      eventSource?.close();
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
    };
  }, [userId]);

  if (status === "connecting") {
    return (
      <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-widest">
        <span className="material-symbols-outlined text-[10px] animate-spin">sync</span>
        <span>Connecting...</span>
      </div>
    );
  }

  if (status === "offline") {
    return (
      <div className="flex items-center gap-2 text-red-500/60 text-xs font-bold uppercase tracking-widest">
        <div className="size-2 rounded-full bg-red-500/40"></div>
        <span>Sync Offline</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className="relative flex items-center justify-center size-3">
          {presence ? (
            <>
              <div className="absolute animate-ping size-3 rounded-full bg-pulse-green opacity-75"></div>
              <div className="relative size-2 rounded-full bg-pulse-green"></div>
            </>
          ) : (
            <div className="relative size-2 rounded-full bg-slate-500"></div>
          )}
        </div>
        <span className={`text-xs font-bold uppercase tracking-widest ${presence ? 'text-pulse-green' : 'text-slate-500'}`}>
          {presence ? 'AI Status: Active' : 'AI Status: Inactive'}
        </span>
      </div>
      
      {presence ? (
        <div className="flex flex-col gap-1">
          <h2 className="text-white text-xl font-bold tracking-tight">
             Working on "{presence.project}"
          </h2>
          <p className="text-sm text-pulse-green/80 font-mono truncate">
            {presence.file}
          </p>
        </div>
      ) : (
        <h2 className="text-slate-400 text-xl font-bold">Currently offline</h2>
      )}
    </div>
  );
}
