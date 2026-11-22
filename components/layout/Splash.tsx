"use client";

import { useEffect, useState } from "react";
import { TicketFill } from "@/components/ui/icons";
import { SPLASH_KEY } from "@/lib/constants";


/** Overlay 1.2 detik saat pertama buka, sekali per sesi. */
export function Splash() {
  const [phase, setPhase] = useState<"show" | "fade" | "gone">("show");

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(SPLASH_KEY) === "1";
    } catch {
      seen = false;
    }
    if (seen) {
      setPhase("gone");
      return;
    }
    const fade = setTimeout(() => setPhase("fade"), 1200);
    const done = setTimeout(() => {
      setPhase("gone");
      try {
        sessionStorage.setItem(SPLASH_KEY, "1");
      } catch {
        /* abaikan */
      }
    }, 1500);
    return () => {
      clearTimeout(fade);
      clearTimeout(done);
    };
  }, []);

  if (phase === "gone") return null;

  return (
    <div
      aria-hidden
      className="splash fixed inset-0 z-[100] mx-auto flex w-full max-w-[393px] items-center justify-center gap-[10px] bg-primary-dark transition-opacity duration-300 ease-in-out"
      style={{ opacity: phase === "fade" ? 0 : 1 }}
    >
      <TicketFill size={40} className="text-accent" />
      <span className="text-[40px] font-bold tracking-[-0.5px] text-white">EventKu</span>
    </div>
  );
}
