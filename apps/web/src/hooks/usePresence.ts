"use client";

import { useState, useEffect } from "react";

export type PresenceUpdate = {
  userId: string;
  project: string;
  file: string;
  language?: string;
  branch?: string;
  timestamp: number;
  activity?: "high" | "peak" | "mid" | "none";
};

export function usePresence(targetUserId?: string) {
  const [presence, setPresence] = useState<PresenceUpdate | null>(null);
  const [status, setStatus] = useState<"connecting" | "live" | "offline">("connecting");

  useEffect(() => {
    let eventSource: EventSource | null = null;
    let reconnectTimeout: NodeJS.Timeout | null = null;
    let isUnmounted = false;

    const connect = () => {
      if (typeof window === "undefined" || isUnmounted) return;
      
      setStatus("connecting");
      const url = targetUserId ? `/api/presence?userId=${targetUserId}` : "/api/presence";
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
  }, [targetUserId]);

  return { presence, status };
}
