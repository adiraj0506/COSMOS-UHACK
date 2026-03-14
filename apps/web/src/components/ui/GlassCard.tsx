"use client";

import React from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function GlassCard({ children, className = "" }: Props) {
  return (
    <div
      className={`rounded-2xl border border-white/10 backdrop-blur-xl p-5 relative overflow-hidden transition-all duration-300 hover:border-violet-500/40 hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] ${className}`}
      style={{
        background:
          "linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
        boxShadow:
          "0 0 0 1px rgba(139,92,246,0.08), 0 20px 60px rgba(0,0,0,0.6), inset 0 0 40px rgba(139,92,246,0.08)",
      }}
    >
      {children}
    </div>
  );
}