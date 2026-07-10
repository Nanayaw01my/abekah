"use client";

import { useState, useEffect } from "react";
import { SplashScreen } from "./SplashScreen";

export function SplashWrapper({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    // Only show once ever (localStorage persists across sessions)
    if (!localStorage.getItem("rf_splash_shown")) {
      setShowSplash(true);
    }
  }, []);

  function handleDone() {
    localStorage.setItem("rf_splash_shown", "1");
    setShowSplash(false);
  }

  return (
    <>
      {showSplash && <SplashScreen onDone={handleDone} />}
      {children}
    </>
  );
}
