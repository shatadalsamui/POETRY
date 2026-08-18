"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StaggerContainer, StaggerItem } from "./Stagger";

import Image from "next/image";

interface GalleryImage {
  id: number;
  title: string;
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
        {images.map((img) => (
          <StaggerItem key={img.id}>
            <div 
              onClick={() => setSelectedImage(img)}
              className="relative group overflow-hidden rounded-sm bg-[var(--color-vintage-ivory)] border-2 border-[var(--color-antique-gold)]/40 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 break-inside-avoid cursor-pointer cursor-zoom-in"
            >
              <Image 
                src={img.src} 
                alt={img.title}
                width={img.width}
                height={img.height}
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />

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
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative rounded-sm shadow-2xl flex flex-col items-center justify-center cursor-default"
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/20 hover:bg-[var(--color-accent)] text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="relative w-full max-w-3xl flex items-center justify-center p-4">
                <Image 
                  src={selectedImage.src}
                  alt="Gallery Image"
                  width={selectedImage.width}
                  height={selectedImage.height}
                  className="max-h-[85vh] w-auto object-contain rounded-sm border-4 border-[var(--color-antique-gold)]/50 shadow-2xl"
                  sizes="100vw"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
