import React from "react";

export default function Divider({ className }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center py-8 ${className || ""}`}>
      <div className="h-px bg-[var(--color-antique-gold)] w-24 opacity-50" />
      <div className="mx-6 flex items-center gap-2 text-[var(--color-antique-gold)] opacity-80 text-lg">
        <span>♦</span>
        <span className="text-sm">♦</span>
        <span>♦</span>
      </div>
      <div className="h-px bg-[var(--color-antique-gold)] w-24 opacity-50" />
    </div>
  );
}
