"use client";

import React from "react";
import { motion } from "framer-motion";

export interface LoadingScreenProps {
  title?: string;
  subtext?: string;
  icon?: React.ElementType;
}

export default function LoadingScreen({
  title = "Cargando",
  subtext,
  icon: Icon,
}: LoadingScreenProps) {
  return (
    <div className="-mt-24 min-h-screen flex flex-col items-center justify-center min-h-[400px] p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        {Icon && (
          <motion.div
            className="relative mb-6"
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <Icon className="w-8 h-8 text-primary" />
            </div>
          </motion.div>
        )}

        <motion.h3
          className="text-xl font-semibold text-foreground mb-2"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          {title}
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            ...
          </motion.span>
        </motion.h3>

        {subtext && (
          <motion.p
            className="text-muted-foreground text-sm mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {subtext}
          </motion.p>
        )}

        <div className="flex justify-center space-x-2">
          {[1, 2, 3, 4].map((dot) => (
            <motion.div
              key={dot}
              className="w-2 h-2 bg-primary rounded-full"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: dot * 0.2 }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
