"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"

interface ImageRevealProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  delay?: number
  direction?: "left" | "right" | "up" | "down"
  showFrame?: boolean
}

export function ImageReveal({ 
  src, 
  alt, 
  width = 800, 
  height = 600, 
  className = "",
  delay = 0,
  direction = "left",
  showFrame = true
}: ImageRevealProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  const getInitialPosition = () => {
    switch (direction) {
      case "left": return { x: "-100%", y: 0 }
      case "right": return { x: "100%", y: 0 }
      case "up": return { x: 0, y: "-100%" }
      case "down": return { x: 0, y: "100%" }
    }
  }

  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* Animated frame borders */}
      {showFrame && (
        <motion.div 
          className="absolute -inset-3 md:-inset-4 pointer-events-none z-10"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: delay + 0.5 }}
        >
          <motion.div 
            className="absolute top-0 left-0 w-6 md:w-10 h-6 md:h-10 border-t-2 border-l-2 border-primary/50"
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ delay: delay + 0.6, type: "spring" }}
          />
          <motion.div 
            className="absolute top-0 right-0 w-6 md:w-10 h-6 md:h-10 border-t-2 border-r-2 border-primary/50"
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ delay: delay + 0.7, type: "spring" }}
          />
          <motion.div 
            className="absolute bottom-0 left-0 w-6 md:w-10 h-6 md:h-10 border-b-2 border-l-2 border-primary/50"
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ delay: delay + 0.8, type: "spring" }}
          />
          <motion.div 
            className="absolute bottom-0 right-0 w-6 md:w-10 h-6 md:h-10 border-b-2 border-r-2 border-primary/50"
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ delay: delay + 0.9, type: "spring" }}
          />
        </motion.div>
      )}
      
      {/* Main image container */}
      <div className="relative overflow-hidden">
        {/* Reveal overlay */}
        <motion.div
          className="absolute inset-0 bg-primary z-10"
          initial={{ x: 0, y: 0 }}
          animate={isInView ? { 
            x: direction === "left" ? "100%" : direction === "right" ? "-100%" : 0,
            y: direction === "up" ? "100%" : direction === "down" ? "-100%" : 0
          } : { x: 0, y: 0 }}
          transition={{
            duration: 1,
            delay,
            ease: [0.77, 0, 0.175, 1]
          }}
        />
        
        {/* Mobile scan line effect */}
        {isMobile && (
          <motion.div
            className="absolute inset-0 z-20 pointer-events-none"
            style={{
              background: "linear-gradient(180deg, transparent 0%, rgba(196, 133, 77, 0.1) 50%, transparent 100%)",
              backgroundSize: "100% 20px",
            }}
            animate={{ y: ["-100%", "200%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: delay + 1 }}
          />
        )}
        
        {/* Image */}
        <motion.div
          initial={{ scale: 1.3, ...getInitialPosition() }}
          animate={isInView ? { scale: 1, x: 0, y: 0 } : { scale: 1.3, ...getInitialPosition() }}
          transition={{
            duration: 1.2,
            delay: delay + 0.1,
            ease: [0.77, 0, 0.175, 1]
          }}
        >
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className="w-full h-full object-cover"
          />
        </motion.div>
        
        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)",
          }}
          initial={{ x: "-100%" }}
          animate={isInView ? { x: "200%" } : { x: "-100%" }}
          transition={{ duration: 1.5, delay: delay + 0.8, ease: "easeInOut" }}
        />
      </div>
    </div>
  )
}

interface MaskRevealProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  delay?: number
  showFrame?: boolean
}

export function MaskReveal({ 
  src, 
  alt, 
  width = 800, 
  height = 600, 
  className = "",
  delay = 0,
  showFrame = true
}: MaskRevealProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* Animated frame */}
      {showFrame && (
        <motion.div 
          className="absolute -inset-3 md:-inset-5 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: delay + 0.8 }}
        >
          {/* Animated border that draws itself */}
          <svg className="absolute inset-0 w-full h-full">
            <motion.rect
              x="2"
              y="2"
              width="calc(100% - 4px)"
              height="calc(100% - 4px)"
              fill="none"
              stroke="rgba(196, 133, 77, 0.4)"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : {}}
              transition={{ duration: 1.5, delay: delay + 0.5, ease: "easeInOut" }}
            />
          </svg>
        </motion.div>
      )}
      
      <div className="relative overflow-hidden">
        <motion.div
          initial={{ clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)" }}
          animate={isInView ? { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" } : { clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)" }}
          transition={{
            duration: 1.2,
            delay,
            ease: [0.77, 0, 0.175, 1]
          }}
        >
          <motion.div
            initial={{ scale: 1.4 }}
            animate={isInView ? { scale: 1 } : { scale: 1.4 }}
            transition={{
              duration: 1.5,
              delay,
              ease: [0.77, 0, 0.175, 1]
            }}
          >
            <Image
              src={src}
              alt={alt}
              width={width}
              height={height}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </motion.div>
        
        {/* Mobile glow effect */}
        {isMobile && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{
              boxShadow: [
                "inset 0 0 30px rgba(196, 133, 77, 0)",
                "inset 0 0 30px rgba(196, 133, 77, 0.2)",
                "inset 0 0 30px rgba(196, 133, 77, 0)",
              ]
            }}
            transition={{ duration: 3, repeat: Infinity, delay: delay + 1 }}
          />
        )}
      </div>
    </div>
  )
}

// New 3D Hover Image Component
interface Image3DProps {
  src: string
  alt: string
  className?: string
}

export function Image3D({ src, alt, className = "" }: Image3DProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current || isMobile) return
    const rect = ref.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setRotation({ x: y * 20, y: x * 20 })
  }
  
  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 })
  }
  
  // Mobile touch handling
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!ref.current) return
    const touch = e.touches[0]
    const rect = ref.current.getBoundingClientRect()
    const x = (touch.clientX - rect.left) / rect.width - 0.5
    const y = (touch.clientY - rect.top) / rect.height - 0.5
    setRotation({ x: y * 15, y: x * 15 })
  }

  return (
    <motion.div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseLeave}
      animate={{
        rotateX: -rotation.x,
        rotateY: rotation.y,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{ transformPerspective: 1000, transformStyle: "preserve-3d" }}
    >
      {/* Animated frame */}
      <motion.div 
        className="absolute -inset-2 md:-inset-3 pointer-events-none z-10"
      >
        <motion.div 
          className="absolute top-0 left-0 w-6 h-6 md:w-8 md:h-8 border-t-2 border-l-2 border-primary/50"
          animate={{
            borderColor: ["rgba(196, 133, 77, 0.5)", "rgba(196, 133, 77, 0.8)", "rgba(196, 133, 77, 0.5)"]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-0 right-0 w-6 h-6 md:w-8 md:h-8 border-b-2 border-r-2 border-primary/50"
          animate={{
            borderColor: ["rgba(196, 133, 77, 0.5)", "rgba(196, 133, 77, 0.8)", "rgba(196, 133, 77, 0.5)"]
          }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        />
      </motion.div>
      
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
      />
      
      {/* 3D shine effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(${105 + rotation.y * 2}deg, transparent 40%, rgba(255,255,255,${0.1 + Math.abs(rotation.y) * 0.01}) 50%, transparent 60%)`,
        }}
      />
    </motion.div>
  )
}
