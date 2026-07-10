"use client";

import { useState, useEffect } from "react";
import { SplashScreen } from "./SplashScreen";

export function SplashWrapper({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    // Only show once per browser session
    if (!sessionStorage.getItem("splash_shown")) {
      setShowSplash(true);
    }
  }, []);

  function handleDone() {
    sessionStorage.setItem("splash_shown", "1");
    setShowSplash(false);
  }

  return (
    <>
      {showSplash && <SplashScreen onDone={handleDone} />}
      {children}
    </>
  );
}
