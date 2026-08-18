"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Bird {
  id: number;
  y: number; // vertical position (vh)
  size: number;
  duration: number; // flying speed
  delay: number;
  opacity: number;
  scaleY: number; // simulates wing flapping
}

const FlyingBirdSVG = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="currentColor">
    {/* A classic minimalist flying bird silhouette */}
    <path d="M2 12 Q7 4 12 12 Q17 4 22 12 Q17 8 12 14 Q7 8 2 12 Z" />
  </svg>
);

export default function FlyingBirds() {
  const [birds, setBirds] = useState<Bird[]>([]);

  useEffect(() => {
    // Generate a flock of birds
    const flockSize = window.innerWidth < 768 ? 5 : 12;
    
    const newBirds = Array.from({ length: flockSize }).map((_, i) => ({
      id: i,
      // Keep them in the upper part of the sky (5vh to 35vh)
      y: Math.random() * 30 + 5,
      // Varies between distant and closer birds
      size: Math.random() * 12 + 10,
      // Slower, majestic flying speed (20s to 40s to cross screen)
      duration: Math.random() * 20 + 20,
      // Staggered start times
      delay: Math.random() * 20,
      // Distant birds are fainter
      opacity: Math.random() * 0.4 + 0.3,
      scaleY: Math.random() * 0.5 + 0.5,
    }));

    setBirds(newBirds);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {birds.map((b) => (
        <motion.div
          key={b.id}
          className="absolute text-[#2a2622] drop-shadow-sm" // dark brown/black bird silhouettes
          style={{
            top: `${b.y}vh`,
            width: `${b.size}px`,
            height: `${b.size}px`,
            opacity: b.opacity,
          }}
          animate={{
            x: ["-10vw", "110vw"],
            // Slight vertical bobbing
            y: [`${b.y}vh`, `${b.y - 2}vh`, `${b.y}vh`, `${b.y + 2}vh`, `${b.y}vh`],
          }}
          transition={{
            x: {
              duration: b.duration,
              delay: b.delay,
              repeat: Infinity,
              ease: "linear",
            },
            y: {
              duration: b.duration / 4, // Bobs 4 times across the screen
              delay: b.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }
          }}
        >
          {/* Flapping animation */}
          <motion.div
            animate={{
              scaleY: [1, -0.5, 1], // The wings flap up and down
            }}
            transition={{
              duration: Math.random() * 0.4 + 0.6, // Each bird flaps at slightly different speeds
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-full h-full origin-center"
          >
            <FlyingBirdSVG />
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}
