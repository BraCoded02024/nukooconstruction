"use client"

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { useRef, type ReactNode } from "react"

interface TiltCardProps {
  children: ReactNode
  className?: string
}

export function TiltCard({ children, className = "" }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  
  const x = useMotionValue(0.5)
  const y = useMotionValue(0.5)
  
  const springConfig = { damping: 20, stiffness: 300 }
  const xSpring = useSpring(x, springConfig)
  const ySpring = useSpring(y, springConfig)
  
  const rotateX = useTransform(ySpring, [0, 1], [15, -15])
  const rotateY = useTransform(xSpring, [0, 1], [-15, 15])
  const brightness = useTransform(xSpring, [0, 0.5, 1], [0.9, 1, 1.1])
  
  const glareX = useTransform(xSpring, [0, 1], ["0%", "100%"])
  const glareY = useTransform(ySpring, [0, 1], ["0%", "100%"])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    
    const rect = ref.current.getBoundingClientRect()
    const xPos = (e.clientX - rect.left) / rect.width
    const yPos = (e.clientY - rect.top) / rect.height
    
    x.set(xPos)
    y.set(yPos)
  }

  const handleMouseLeave = () => {
    x.set(0.5)
    y.set(0.5)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1000,
        transformStyle: "preserve-3d",
        filter: `brightness(${brightness.get()})`,
      }}
      className={`relative ${className}`}
    >
      {children}
      
      {/* Glare effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-inherit"
        style={{
          background: `radial-gradient(circle at ${glareX.get()} ${glareY.get()}, rgba(255,255,255,0.15) 0%, transparent 60%)`,
        }}
      />
    </motion.div>
  )
}
