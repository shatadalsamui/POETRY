import React from 'react';

export default function Watermark() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden flex justify-center items-center opacity-[0.03]">
      <svg
        width="600"
        height="600"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-neutral-900"
      >
        <path
          d="M50 5 C55 20, 70 30, 90 40 C70 50, 55 60, 50 80 C45 60, 30 50, 10 40 C30 30, 45 20, 50 5 Z"
          fill="currentColor"
        />
        <path
          d="M50 20 C52 30, 60 35, 70 40 C60 45, 52 50, 50 60 C48 50, 40 45, 30 40 C40 35, 48 30, 50 20 Z"
          fill="#fff"
        />
        <circle cx="50" cy="40" r="5" fill="currentColor" />
      </svg>
    </div>
  );
}
