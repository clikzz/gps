"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface CarouselStackProps {
  images: string[]
}

export default function CarouselStack({ images }: CarouselStackProps) {
  const [index, setIndex] = useState(0)
  const total = images.length

  if (total === 0) return null

  const dist = (i: number) => (i - index + total) % total

  return (
    <motion.div
      className="w-full flex flex-col items-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="relative w-full mb-4 overflow-visible">
        <div className="relative w-64 h-48 sm:w-80 sm:h-60 md:w-96 md:h-72 lg:w-[28rem] lg:h-80 mx-auto">
          <AnimatePresence initial={false} mode="popLayout">
            {images.map((src, i) => {
              const d = dist(i)
              if (d > 1 && d < total - 1) return null

              let offsetX = 0
              let scale = 1
              let opacity = 1
              let zIndex = 20
              let rotateY = 0
              let blur = 0

              if (d === 1) {
                offsetX = window.innerWidth < 640 ? 80 : window.innerWidth < 768 ? 100 : 120
                scale = window.innerWidth < 640 ? 0.75 : 0.85
                opacity = 0.7
                zIndex = 10
                rotateY = -15
                blur = 1
              }

              if (total > 1 && d === total - 1) {
                offsetX = window.innerWidth < 640 ? -80 : window.innerWidth < 768 ? -100 : -120
                scale = window.innerWidth < 640 ? 0.75 : 0.85
                opacity = 0.7
                zIndex = 10
                rotateY = 15
                blur = 1
              }

              return (
                <motion.div
                  key={src}
                  className="absolute top-0 left-1/2 w-full h-full rounded-xl overflow-hidden border-4 border-card shadow-2xl cursor-pointer"
                  style={{
                    zIndex,
                    perspective: "1000px",
                  }}
                  initial={{
                    x: "-50%",
                    scale: 0.8,
                    opacity: 0,
                    rotateY: d === 1 ? 30 : d === total - 1 ? -30 : 0,
                  }}
                  animate={{
                    x: `calc(-50% + ${offsetX}px)`,
                    scale,
                    opacity,
                    rotateY,
                    filter: `blur(${blur}px)`,
                  }}
                  exit={{
                    x: "-50%",
                    scale: 0.8,
                    opacity: 0,
                    rotateY: offsetX > 0 ? 30 : offsetX < 0 ? -30 : 0,
                  }}
                  transition={{
                    duration: 0.6,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  whileHover={
                    d === 0
                      ? {
                          scale: window.innerWidth < 640 ? 1.01 : 1.02,
                          y: window.innerWidth < 640 ? -3 : -5,
                          transition: { duration: 0.3, ease: "easeOut" },
                        }
                      : {
                          scale: scale * 1.05,
                          opacity: opacity * 1.2,
                          filter: `blur(${blur * 0.5}px)`,
                          transition: { duration: 0.3, ease: "easeOut" },
                        }
                  }
                  onClick={() => setIndex(i)}
                >
                  <motion.img
                    src={src}
                    alt={`Memory ${i + 1}`}
                    className="w-full h-full object-cover"
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                  {d !== 0 && (
                    <motion.div
                      className="absolute inset-0 bg-black/20"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>

      {total > 1 && (
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <div className="flex space-x-2 mb-2">
            {images.map((_, i) => (
              <motion.button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Ir a imagen ${i + 1}`}
                className="relative rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5 + i * 0.05, duration: 0.3 }}
              >
                <motion.div
                  className={`rounded-full ${i === index ? "w-3 h-3 bg-primary" : "w-2 h-2 bg-muted-foreground/60"}`}
                  animate={{
                    scale: i === index ? 1 : 0.8,
                    backgroundColor: i === index ? "hsl(var(--primary))" : "hsl(var(--muted-foreground) / 0.6)",
                  }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
                {i === index && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-primary/30"
                    initial={{ scale: 1, opacity: 0.8 }}
                    animate={{ scale: 2, opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    key={`ripple-${index}`}
                  />
                )}
              </motion.button>
            ))}
          </div>
          <motion.span
            className="text-sm text-muted-foreground font-medium"
            key={index}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {index + 1} / {total}
          </motion.span>
        </motion.div>
      )}
    </motion.div>
  )
}
