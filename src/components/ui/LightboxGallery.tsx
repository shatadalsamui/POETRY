"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StaggerContainer, StaggerItem } from "./Stagger";

import Image from "next/image";

interface GalleryImage {
  id: number;
  title?: string;
  caption?: string;
  src: string;
  width: number;
  height: number;
}

interface LightboxGalleryProps {
  images: GalleryImage[];
}

export default function LightboxGallery({ images }: LightboxGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  return (
    <>
      <StaggerContainer className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {images.map((img, index) => (
          <StaggerItem key={img.id}>
            <div 
              onClick={() => setSelectedImage(img)}
              className="relative group overflow-hidden rounded-sm bg-[var(--color-vintage-ivory)] border-2 border-[var(--color-antique-gold)]/40 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 break-inside-avoid cursor-pointer flex flex-col"
            >
              <div className="relative overflow-hidden cursor-zoom-in">
                <Image 
                  src={img.src} 
                  alt={img.caption || img.title || "গ্যালারি চিত্র"}
                  width={img.width}
                  height={img.height}
                  priority={index < 3}
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
              </div>

              {/* Caption Area */}
              {img.caption && (
                <div className="p-3.5 sm:p-4 text-center bg-[#fbf9f4] border-t border-[var(--color-antique-gold)]/30">
                  <p className="text-sm sm:text-base font-serif font-medium text-[var(--color-ink)] leading-snug">
                    {img.caption}
                  </p>
                </div>
              )}
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative rounded-sm shadow-2xl flex flex-col items-center justify-center cursor-default max-w-4xl"
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 sm:top-2 sm:right-2 z-10 w-10 h-10 bg-white/20 hover:bg-[var(--color-accent)] text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-sm shadow-lg"
                title="বন্ধ করুন"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="relative w-full flex flex-col items-center justify-center p-2 sm:p-4">
                <Image 
                  src={selectedImage.src}
                  alt={selectedImage.caption || "Gallery Image"}
                  width={selectedImage.width}
                  height={selectedImage.height}
                  className="max-h-[78vh] w-auto object-contain rounded-xs border-2 sm:border-4 border-[var(--color-antique-gold)]/60 shadow-2xl"
                  sizes="100vw"
                />

                {/* Lightbox Caption */}
                {selectedImage.caption && (
                  <div className="mt-4 px-6 py-2 rounded-full bg-black/60 border border-[var(--color-antique-gold)]/40 text-white font-serif text-sm sm:text-base text-center backdrop-blur-sm shadow-lg">
                    {selectedImage.caption}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
