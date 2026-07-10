"use client";

import { useEffect, useState } from "react";

export function SplashScreen({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"in" | "hold" | "out">("in");

  useEffect(() => {
    // progress bar over 9s, then fade out at 9.2s, call onDone at 10s
    const start = Date.now();
    const duration = 9000;
    const raf = requestAnimationFrame(function tick() {
      const elapsed = Date.now() - start;
      setProgress(Math.min(elapsed / duration, 1));
      if (elapsed < duration) requestAnimationFrame(tick);
      else setProgress(1);
    });

    const outTimer = setTimeout(() => setPhase("out"), 9200);
    const doneTimer = setTimeout(onDone, 10000);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(outTimer);
      clearTimeout(doneTimer);
    };
  }, [onDone]);

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "radial-gradient(ellipse at 60% 40%, #064e1b 0%, #022c0e 50%, #000 100%)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        transition: "opacity 0.8s ease",
        opacity: phase === "out" ? 0 : 1,
        pointerEvents: phase === "out" ? "none" : "all",
      }}
    >
      <style>{`
        @keyframes orbit1 {
          from { transform: rotateZ(0deg) rotateX(60deg) rotateZ(0deg); }
          to   { transform: rotateZ(360deg) rotateX(60deg) rotateZ(-360deg); }
        }
        @keyframes orbit2 {
          from { transform: rotateZ(120deg) rotateX(70deg) rotateZ(-120deg); }
          to   { transform: rotateZ(480deg) rotateX(70deg) rotateZ(-480deg); }
        }
        @keyframes orbit3 {
          from { transform: rotateZ(240deg) rotateX(50deg) rotateZ(-240deg); }
          to   { transform: rotateZ(600deg) rotateX(50deg) rotateZ(-600deg); }
        }
        @keyframes pulseGlow {
          0%,100% { box-shadow: 0 0 40px 12px rgba(34,197,94,0.35), 0 0 0 0 rgba(34,197,94,0.15); }
          50%      { box-shadow: 0 0 80px 30px rgba(34,197,94,0.55), 0 0 120px 60px rgba(34,197,94,0.1); }
        }
        @keyframes floatUp {
          0%   { opacity:0; transform: translateY(30px) scale(0.85); }
          100% { opacity:1; transform: translateY(0)   scale(1); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes particleDrift {
          0%   { transform: translateY(0)   translateX(0)   opacity(0.6); opacity: 0.6; }
          50%  { opacity: 1; }
          100% { transform: translateY(-120px) translateX(var(--dx)) opacity(0); opacity: 0; }
        }
        @keyframes spin3d {
          from { transform: perspective(400px) rotateY(0deg) rotateX(15deg); }
          to   { transform: perspective(400px) rotateY(360deg) rotateX(15deg); }
        }
        .splash-title {
          background: linear-gradient(90deg, #4ade80, #86efac, #ffffff, #86efac, #4ade80);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite, floatUp 0.9s ease both;
          animation-delay: 0s, 0.4s;
          opacity: 0;
        }
        .splash-sub {
          animation: floatUp 0.9s ease 0.8s both;
          opacity: 0;
        }
        .splash-tagline {
          animation: floatUp 0.9s ease 1.1s both;
          opacity: 0;
        }
        .splash-bar-wrap {
          animation: floatUp 0.9s ease 1.4s both;
          opacity: 0;
        }
      `}</style>

      {/* Ambient particles */}
      {Array.from({ length: 18 }).map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          width: i % 3 === 0 ? 6 : i % 3 === 1 ? 4 : 3,
          height: i % 3 === 0 ? 6 : i % 3 === 1 ? 4 : 3,
          borderRadius: "50%",
          background: i % 4 === 0 ? "#4ade80" : i % 4 === 1 ? "#86efac" : i % 4 === 2 ? "#22c55e" : "#bbf7d0",
          left: `${8 + (i * 5.2) % 84}%`,
          top: `${10 + (i * 7.3) % 80}%`,
          ["--dx" as string]: `${(i % 2 === 0 ? 1 : -1) * (10 + (i * 13) % 40)}px`,
          animation: `particleDrift ${2.5 + (i * 0.37) % 3}s ease-in-out ${(i * 0.41) % 2.5}s infinite`,
          opacity: 0.6,
        }} />
      ))}

      {/* 3D orbital rings */}
      <div style={{ position: "absolute", width: 380, height: 380, perspective: 700 }}>
        {[
          { anim: "orbit1 6s linear infinite", color: "rgba(34,197,94,0.55)", w: 380, h: 380 },
          { anim: "orbit2 9s linear infinite", color: "rgba(134,239,172,0.35)", w: 300, h: 300 },
          { anim: "orbit3 12s linear infinite reverse", color: "rgba(74,222,128,0.25)", w: 220, h: 220 },
        ].map((ring, i) => (
          <div key={i} style={{
            position: "absolute",
            inset: `${i * 40}px`,
            border: `1.5px solid ${ring.color}`,
            borderRadius: "50%",
            animation: ring.anim,
            transformStyle: "preserve-3d",
          }}>
            {/* dot on ring */}
            <div style={{
              position: "absolute", top: -4, left: "50%", marginLeft: -4,
              width: 8, height: 8, borderRadius: "50%",
              background: ring.color.replace("0.", "1."),
              boxShadow: `0 0 10px 3px ${ring.color}`,
            }} />
          </div>
        ))}

        {/* Central logo sphere */}
        <div style={{
          position: "absolute", inset: "140px",
          borderRadius: "50%",
          background: "radial-gradient(circle at 35% 35%, #22c55e, #064e1b)",
          animation: "pulseGlow 2.5s ease-in-out infinite",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg viewBox="0 0 24 24" style={{ width: 42, height: 42, fill: "white", filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.4))" }}>
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        </div>
      </div>

      {/* Text */}
      <div style={{ marginTop: 220, textAlign: "center", padding: "0 24px" }}>
        <h1 className="splash-title" style={{ fontSize: "clamp(2rem,6vw,3.5rem)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
          Rental Property Finder
        </h1>
        <p className="splash-sub" style={{ color: "#86efac", fontSize: "clamp(0.9rem,2.5vw,1.15rem)", marginTop: 10, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          Ghana&apos;s #1 Property Platform
        </p>
        <p className="splash-tagline" style={{ color: "rgba(255,255,255,0.45)", fontSize: "clamp(0.8rem,2vw,1rem)", marginTop: 8 }}>
          Find. Connect. Move In.
        </p>

        {/* Progress bar */}
        <div className="splash-bar-wrap" style={{ marginTop: 36, width: "min(280px, 70vw)" }}>
          <div style={{ height: 3, borderRadius: 99, background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
            <div style={{
              height: "100%", borderRadius: 99,
              background: "linear-gradient(90deg, #22c55e, #86efac)",
              width: `${progress * 100}%`,
              transition: "width 0.1s linear",
              boxShadow: "0 0 10px 2px rgba(34,197,94,0.6)",
            }} />
          </div>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, marginTop: 10, letterSpacing: "0.1em" }}>
            LOADING EXPERIENCE
          </p>
        </div>
      </div>
    </div>
  );
}
