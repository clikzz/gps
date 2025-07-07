// components/ui/CarouselStack.tsx
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselStackProps {
  images: string[];
}

export default function CarouselStack({ images }: CarouselStackProps) {
  const [index, setIndex] = useState(0);
  const total = images.length;
  if (total === 0) return null;

  const prevImage = () => setIndex((i) => (i - 1 + total) % total);
  const nextImage = () => setIndex((i) => (i + 1) % total);

  // Distancia modular respecto al índice actual
  const dist = (i: number) => (i - index + total) % total;

  return (
    <div className="w-full flex flex-col items-center">
      {/* Carrusel full-width para que las flechas queden fuera */}
      <div className="relative w-full mb-4 overflow-visible">
        {/* Wrapper centrado de ancho fijo */}
        <div className="relative w-80 h-60 mx-auto">
          <AnimatePresence initial={false}>
            {images.map((src, i) => {
              const d = dist(i);

              // Solo previa (total-1), activa (0) y siguiente (1)
              if (d > 1 && d < total - 1) return null;

              // Valores por defecto (imagen activa)
              let offsetX = 0;
              let scale   = 1;
              let opacity = 1;
              let zIndex  = 20;

              // Siguiente preview
              if (d === 1) {
                offsetX = 120;
                scale   = 0.8;
                opacity = 0.6;
                zIndex  = 10;
              }

              // Preview anterior, SOLO si hay más de una imagen
              if (total > 1 && d === total - 1) {
                offsetX = -120;
                scale   = 0.8;
                opacity = 0.6;
                zIndex  = 10;
              }

              // Transforms: base y centro
              const baseTransform   = `translateX(calc(-50% + ${offsetX}px)) scale(${scale})`;
              const centerTransform = `translateX(calc(-50% +   0px   )) scale(${scale})`;

              return (
                <motion.div
                  key={src}
                  className="absolute top-0 left-1/2 w-full h-full
                             rounded-xl overflow-hidden border-4 border-card
                             shadow-2xl cursor-pointer"
                  style={{ zIndex }}
                  initial={{ transform: centerTransform, opacity: 0 }}
                  animate={{ transform: baseTransform, opacity }}
                  exit   ={{ transform: centerTransform, opacity: 0 }}
                  transition={{
                    transform: { duration: 0.3 },
                    opacity:   { duration: 0.1 }
                  }}
                  onClick={() => setIndex(i)}
                >
                  <img
                    src={src}
                    alt={`Memory ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Flechas fuera del w-80, pegadas a los bordes del contenedor full-width */}
        {total > 1 && (
          <>
            <button
              onClick={prevImage}
              aria-label="Anterior"
              className="absolute top-1/2 left-0 -translate-y-1/2
                         bg-card p-2 rounded-full shadow-lg hover:scale-110
                         transition z-30"
            >
              <ChevronLeft size={20} className="text-foreground" />
            </button>
            <button
              onClick={nextImage}
              aria-label="Siguiente"
              className="absolute top-1/2 right-0 -translate-y-1/2
                         bg-card p-2 rounded-full shadow-lg hover:scale-110
                         transition z-30"
            >
              <ChevronRight size={20} className="text-foreground" />
            </button>
          </>
        )}
      </div>

      {/* Indicadores: dots arriba, contador debajo */}
      {total > 1 && (
        <div className="flex flex-col items-center">
          <div className="flex space-x-1">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Ir a imagen ${i + 1}`}
                className={`rounded-full transition-opacity duration-300 ${
                  i === index
                    ? "w-3 h-3 bg-primary"
                    : "w-2 h-2 bg-muted-foreground"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground mt-1">
            {index + 1} / {total}
          </span>
        </div>
      )}
    </div>
  );
}
