"use client"

import { motion } from "framer-motion"

export function FloatingShapes() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Large rotating ring */}
      <motion.div
        className="absolute -top-40 -right-40 w-96 h-96 border border-primary/10 rounded-full"
        animate={{
          rotate: 360,
          scale: [1, 1.1, 1],
        }}
        transition={{
          rotate: { duration: 30, repeat: Infinity, ease: "linear" },
          scale: { duration: 8, repeat: Infinity, ease: "easeInOut" },
        }}
      />
      
      {/* Floating diamond */}
      <motion.div
        className="absolute top-1/4 left-10 w-8 h-8 bg-primary/5 rotate-45"
        animate={{
          y: [-20, 20, -20],
          x: [-10, 10, -10],
          rotate: [45, 90, 45],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Pulsing circle */}
      <motion.div
        className="absolute top-1/2 right-20 w-4 h-4 bg-accent/20 rounded-full"
        animate={{
          scale: [1, 2, 1],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Floating line */}
      <motion.div
        className="absolute bottom-1/4 left-1/4 w-20 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"
        animate={{
          x: [-50, 50, -50],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Small dots constellation */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-primary/20 rounded-full"
          style={{
            top: `${20 + i * 15}%`,
            left: `${80 + Math.sin(i) * 10}%`,
          }}
          animate={{
            y: [-10, 10, -10],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 3 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
        />
      ))}
      
      {/* Large gradient orb */}
      <motion.div
        className="absolute -bottom-32 -left-32 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [-20, 20, -20],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Rotating square frame */}
      <motion.div
        className="absolute top-2/3 right-1/4 w-16 h-16 border border-primary/10"
        animate={{
          rotate: [0, 180, 360],
          scale: [1, 0.8, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  )
}
