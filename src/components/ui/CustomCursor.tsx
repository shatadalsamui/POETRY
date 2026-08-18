"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PenTool } from "lucide-react";

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    // Only run on non-touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // If hovering over a clickable element, enlarge the cursor
      if (
        target.tagName === "A" || 
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.classList.contains("cursor-pointer")
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  return (
    <>
      {/* Inner Dot (Pen Nib) */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] hidden md:flex items-center justify-center text-[var(--color-antique-gold)] drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] origin-top-left"
        animate={{
          x: mousePosition.x - 4, // align the tip to the pointer coordinate
          y: mousePosition.y - 4,
          scale: isHovering ? 1.2 : 1,
          rotate: isHovering ? -15 : 0,
        }}
        transition={{ type: "tween", ease: "backOut", duration: 0.15 }}
      >
        <PenTool className="w-7 h-7" strokeWidth={1.5} />
      </motion.div>
    </>
  );
}
