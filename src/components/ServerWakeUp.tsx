"use client";

import { useEffect, useState } from "react";

export function ServerWakeUp({ children }: { children: React.ReactNode }) {
  const [awake, setAwake] = useState(false);
  const [dots, setDots] = useState(".");

  useEffect(() => {
    let attempts = 0;
    let cancelled = false;

    async function ping() {
      try {
        const res = await fetch("/api/ping", { cache: "no-store" });
        if (res.ok && !cancelled) { setAwake(true); return; }
      } catch {}
      attempts++;
      if (!cancelled) setTimeout(ping, Math.min(2000 * attempts, 8000));
    }

    ping();

    const dotTimer = setInterval(() => {
      if (!cancelled) setDots(d => d.length >= 3 ? "." : d + ".");
    }, 500);

    return () => { cancelled = true; clearInterval(dotTimer); };
  }, []);

  if (awake) return <>{children}</>;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-14 h-14 rounded-2xl bg-green-600 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-green-200">
          <svg viewBox="0 0 24 24" className="w-7 h-7 text-white fill-current">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        </div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">Starting up{dots}</h2>
        <p className="text-sm text-gray-500">The server is waking up, please wait a moment.</p>
        <div className="mt-5 w-48 h-1.5 bg-gray-200 rounded-full mx-auto overflow-hidden">
          <div className="h-full bg-green-500 rounded-full animate-[shimmer_1.5s_ease-in-out_infinite]"
            style={{ width: "40%", animation: "wakeBarSlide 1.8s ease-in-out infinite" }} />
        </div>
      </div>
      <style>{`
        @keyframes wakeBarSlide {
          0%   { margin-left: 0%; width: 30%; }
          50%  { margin-left: 70%; width: 30%; }
          100% { margin-left: 0%; width: 30%; }
        }
      `}</style>
    </div>
  );
}
