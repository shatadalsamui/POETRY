"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

export default function FallingParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 6 : 20; // Significantly fewer on mobile for smooth performance
    
    const newParticles = Array.from({ length: particleCount }).map((_, i) => {
      const isLeftSide = i % 2 === 0;
      const startX = isLeftSide 
        ? Math.random() * 15 // Left side: 0 to 15vw
        : 85 + Math.random() * 15; // Right side: 85 to 100vw

      return {
        id: i,
        x: startX,
        y: -10 - Math.random() * 20, // start above the screen
        size: Math.random() * 28 + 28, // Reduced by 30% (was 40-80px, now 28-56px)
        duration: Math.random() * 15 + 10, // 10s to 25s falling time
        delay: Math.random() * 10, // random start delay
        opacity: Math.random() * 0.4 + 0.6, // 0.6 to 1.0 opacity
      };
    });

    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden mix-blend-screen">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute flex items-center justify-center"
          style={{
            left: `${p.x}vw`,
            top: `${p.y}vh`,
            opacity: p.opacity,
            width: `${p.size}px`,
            height: `${p.size}px`,
            willChange: "transform",
          }}
          animate={{
            y: ["0vh", "120vh"],
            x: [`0vw`, `${(Math.random() - 0.5) * 15}vw`], 
            rotate: [0, Math.random() > 0.5 ? 360 : -360],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {/* We use a black background image and mix-blend-screen to perfectly cut out the fluff */}
          <img 
            src="/kash_phool_particle.png" 
            alt="Kash Phool" 
            className="w-full h-full object-contain contrast-[2.0] brightness-90 grayscale"
          />
        </motion.div>
      ))}
    </div>
  );
}
