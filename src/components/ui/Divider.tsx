import React from "react";

export default function Divider({ className }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center py-2 ${className || ""}`}>
      <div className="h-px bg-[var(--color-antique-gold)] w-24 opacity-50" />
      <div className="mx-4 flex items-center gap-1.5 text-[var(--color-antique-gold)] opacity-80 text-base">
        <span>♦</span>
        <span className="text-xs">♦</span>
        <span>♦</span>
      </div>
      <div className="h-px bg-[var(--color-antique-gold)] w-24 opacity-50" />
    </div>
  );
}
