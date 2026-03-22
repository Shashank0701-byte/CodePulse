"use client";

import dynamic from 'next/dynamic';

const LiveStatus = dynamic(() => import('./LiveStatus'), { 
  ssr: false,
  loading: () => (
    <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-widest">
      <span className="material-symbols-outlined text-[10px] animate-spin">sync</span>
      <span>Initializing Pulse...</span>
    </div>
  )
});

export function DynamicLiveStatus({ userId }: { userId?: string }) {
  return <LiveStatus userId={userId} />;
}
