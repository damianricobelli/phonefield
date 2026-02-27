import * as React from "react";

export function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-slate-300 bg-white/80 px-3 py-1 text-xs font-medium text-slate-700">
      {children}
    </span>
  );
}
