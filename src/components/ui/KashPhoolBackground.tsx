"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const backgrounds = [
  "/bg-1.png",
  "/bg-2.png",
  "/bg-3.png",
  "/bg-4.png",
  "/bg-5.png"
];

export default function KashPhoolBackground() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Very slow, peaceful cycle every 10 seconds
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % backgrounds.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-[var(--color-vintage-ivory)]">
      
      <div className="absolute inset-0 opacity-80 sepia-[.1]">
        <div className="relative w-full h-full [mask-image:linear-gradient(to_top,black_85%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_top,black_85%,transparent_100%)]">
          {/* AnimatePresence handles smooth crossfading of elements as they mount/unmount */}
          <AnimatePresence initial={false}>
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 1.0 }}
              animate={{ opacity: 1, scale: 1.04 }}
              exit={{ opacity: 0 }}
              transition={{
                opacity: { duration: 3, ease: "easeInOut" },
                scale: { duration: 10, ease: "linear" }
              }}
              className="absolute inset-0"
              style={{ willChange: "transform, opacity" }}
            >
              <Image
                src={backgrounds[currentIndex]}
                alt={`Autumn Landscape ${currentIndex + 1}`}
                fill
                className="object-cover object-center"
                quality={75} // use default configured quality
                priority={currentIndex === 0} // only strictly require the first one immediately
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      
      {/* Extra soft vintage ivory gradient on top to ensure text remains perfectly readable */}
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-vintage-ivory)]/40 via-transparent to-transparent opacity-50" />
    </div>
  );
}
