"use client"

import { motion } from "framer-motion"
import { type ReactNode } from "react"

interface MarqueeProps {
  children: ReactNode
  speed?: number
  direction?: "left" | "right"
  className?: string
  pauseOnHover?: boolean
}

export function Marquee({ 
  children, 
  speed = 30, 
  direction = "left", 
  className = "",
  pauseOnHover = true 
}: MarqueeProps) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        className="flex gap-8 whitespace-nowrap"
        animate={{
          x: direction === "left" ? [0, "-50%"] : ["-50%", 0]
        }}
        transition={{
          x: {
            duration: speed,
            repeat: Infinity,
            ease: "linear"
          }
        }}
        whileHover={pauseOnHover ? { animationPlayState: "paused" } : undefined}
      >
        {children}
        {children}
      </motion.div>
    </div>
  )
}

interface TextMarqueeProps {
  text: string
  speed?: number
  direction?: "left" | "right"
  className?: string
  textClassName?: string
}

export function TextMarquee({ 
  text, 
  speed = 20, 
  direction = "left", 
  className = "",
  textClassName = ""
}: TextMarqueeProps) {
  const items = Array(10).fill(text)
  
  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        className="flex whitespace-nowrap"
        animate={{
          x: direction === "left" ? [0, "-50%"] : ["-50%", 0]
        }}
        transition={{
          x: {
            duration: speed,
            repeat: Infinity,
            ease: "linear"
          }
        }}
      >
        {items.map((item, i) => (
          <span key={i} className={`mx-8 ${textClassName}`}>
            {item}
            <span className="mx-8 text-primary/30">*</span>
          </span>
        ))}
      </motion.div>
    </div>
  )
}
