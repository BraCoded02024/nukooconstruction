"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"

interface TextRevealProps {
  children: string
  className?: string
  delay?: number
  staggerDelay?: number
}

export function TextReveal({ children, className = "", delay = 0, staggerDelay = 0.03 }: TextRevealProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  
  const words = children.split(" ")

  return (
    <span ref={ref} className={`inline-block ${className}`}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block mr-[0.25em]">
          {word.split("").map((char, charIndex) => (
            <motion.span
              key={charIndex}
              className="inline-block"
              initial={{ y: 100, opacity: 0, rotateX: -90 }}
              animate={isInView ? { y: 0, opacity: 1, rotateX: 0 } : { y: 100, opacity: 0, rotateX: -90 }}
              transition={{
                duration: 0.5,
                delay: delay + (wordIndex * word.length + charIndex) * staggerDelay,
                ease: [0.215, 0.61, 0.355, 1],
              }}
              style={{ transformOrigin: "bottom" }}
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </span>
  )
}

interface LineRevealProps {
  children: string
  className?: string
  delay?: number
}

export function LineReveal({ children, className = "", delay = 0 }: LineRevealProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <span ref={ref} className={`block overflow-hidden ${className}`}>
      <motion.span
        className="block"
        initial={{ y: "100%" }}
        animate={isInView ? { y: 0 } : { y: "100%" }}
        transition={{
          duration: 0.8,
          delay,
          ease: [0.215, 0.61, 0.355, 1],
        }}
      >
        {children}
      </motion.span>
    </span>
  )
}

interface SplitTextProps {
  children: string
  className?: string
  delay?: number
}

export function SplitText({ children, className = "", delay = 0 }: SplitTextProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  
  const lines = children.split("\n")

  return (
    <span ref={ref} className={className}>
      {lines.map((line, lineIndex) => (
        <span key={lineIndex} className="block overflow-hidden">
          <motion.span
            className="block"
            initial={{ y: "100%", skewY: 7 }}
            animate={isInView ? { y: 0, skewY: 0 } : { y: "100%", skewY: 7 }}
            transition={{
              duration: 0.8,
              delay: delay + lineIndex * 0.1,
              ease: [0.215, 0.61, 0.355, 1],
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  )
}
