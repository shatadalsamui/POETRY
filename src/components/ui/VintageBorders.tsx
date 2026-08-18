import React from "react";

export default function VintageBorders() {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden opacity-30 mix-blend-multiply">
      
      {/* Top Left Corner */}
      <div className="absolute top-0 left-0 w-32 h-32 md:w-64 md:h-64">
        <svg viewBox="0 0 100 100" className="w-full h-full text-[var(--color-accent-green)]">
          <path d="M0,0 L100,0 C60,0 0,60 0,100 Z" fill="currentColor" opacity="0.1"/>
          <path d="M0,0 L80,0 C40,0 0,40 0,80 Z" fill="currentColor" opacity="0.2"/>
          <path d="M0,0 L60,0 C20,0 0,20 0,60 Z" fill="currentColor"/>
          <circle cx="15" cy="15" r="3" fill="var(--color-vintage-ivory)" />
          <path d="M5,25 Q15,15 25,5" stroke="var(--color-vintage-ivory)" strokeWidth="1" fill="none" />
        </svg>
      </div>

      {/* Top Right Corner */}
      <div className="absolute top-0 right-0 w-32 h-32 md:w-64 md:h-64 transform scale-x-[-1]">
        <svg viewBox="0 0 100 100" className="w-full h-full text-[var(--color-accent-green)]">
          <path d="M0,0 L100,0 C60,0 0,60 0,100 Z" fill="currentColor" opacity="0.1"/>
          <path d="M0,0 L80,0 C40,0 0,40 0,80 Z" fill="currentColor" opacity="0.2"/>
          <path d="M0,0 L60,0 C20,0 0,20 0,60 Z" fill="currentColor"/>
          <circle cx="15" cy="15" r="3" fill="var(--color-vintage-ivory)" />
          <path d="M5,25 Q15,15 25,5" stroke="var(--color-vintage-ivory)" strokeWidth="1" fill="none" />
        </svg>
      </div>

      {/* Bottom Left Corner */}
      <div className="absolute bottom-0 left-0 w-32 h-32 md:w-64 md:h-64 transform scale-y-[-1]">
        <svg viewBox="0 0 100 100" className="w-full h-full text-[var(--color-accent-green)]">
          <path d="M0,0 L100,0 C60,0 0,60 0,100 Z" fill="currentColor" opacity="0.1"/>
          <path d="M0,0 L80,0 C40,0 0,40 0,80 Z" fill="currentColor" opacity="0.2"/>
          <path d="M0,0 L60,0 C20,0 0,20 0,60 Z" fill="currentColor"/>
          <circle cx="15" cy="15" r="3" fill="var(--color-vintage-ivory)" />
          <path d="M5,25 Q15,15 25,5" stroke="var(--color-vintage-ivory)" strokeWidth="1" fill="none" />
        </svg>
      </div>

      {/* Bottom Right Corner */}
      <div className="absolute bottom-0 right-0 w-32 h-32 md:w-64 md:h-64 transform scale-x-[-1] scale-y-[-1]">
        <svg viewBox="0 0 100 100" className="w-full h-full text-[var(--color-accent-green)]">
          <path d="M0,0 L100,0 C60,0 0,60 0,100 Z" fill="currentColor" opacity="0.1"/>
          <path d="M0,0 L80,0 C40,0 0,40 0,80 Z" fill="currentColor" opacity="0.2"/>
          <path d="M0,0 L60,0 C20,0 0,20 0,60 Z" fill="currentColor"/>
          <circle cx="15" cy="15" r="3" fill="var(--color-vintage-ivory)" />
          <path d="M5,25 Q15,15 25,5" stroke="var(--color-vintage-ivory)" strokeWidth="1" fill="none" />
        </svg>
      </div>
    </div>
  );
}
