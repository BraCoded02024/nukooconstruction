"use client"

import { motion, useInView, useMotionValue, useTransform, animate, useSpring } from "framer-motion"
import { useRef, useEffect, useState } from "react"

interface AnimatedCounterProps {
  value: number
  suffix?: string
  prefix?: string
  duration?: number
}

function AnimatedCounter({ value, suffix = "", prefix = "", duration = 2 }: AnimatedCounterProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const count = useMotionValue(0)
  const rounded = useTransform(count, (latest) => Math.round(latest))
  const [displayValue, setDisplayValue] = useState(0)
  
  useEffect(() => {
    if (isInView) {
      animate(count, value, { duration })
    }
  }, [isInView, value, count, duration])
  
  useEffect(() => {
    const unsubscribe = rounded.on("change", (v) => setDisplayValue(v))
    return () => unsubscribe()
  }, [rounded])

  return (
    <span ref={ref}>
      {prefix}{displayValue}{suffix}
    </span>
  )
}

const stats = [
  { value: 500, suffix: "+", label: "Projects Completed", description: "Exceptional projects delivered across Africa" },
  { value: 12, suffix: "B", prefix: "$", label: "Value Delivered", description: "In property and infrastructure value" },
  { value: "Proven", label: "Years Experience", description: "Unwavering excellence since our founding" },
  { value: 100, suffix: "%", label: "Client Commitment", description: "Driving success through mutual partnership" }
]

function StatCard({ stat, index }: { stat: any, index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0.5)
  const y = useMotionValue(0.5)
  
  const springConfig = { damping: 25, stiffness: 300 }
  const xSpring = useSpring(x, springConfig)
  const ySpring = useSpring(y, springConfig)
  
  const rotateX = useTransform(ySpring, [0, 1], [8, -8])
  const rotateY = useTransform(xSpring, [0, 1], [-8, 8])
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const handleMove = (clientX: number, clientY: number) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    x.set((clientX - rect.left) / rect.width)
    y.set((clientY - rect.top) / rect.height)
  }

  return (
    <motion.div
      ref={ref}
      className="text-center relative p-6 md:p-8 group"
      initial={{ opacity: 0, y: 50, rotateX: 15 }}
      animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 50, rotateX: 15 }}
      transition={{ duration: 0.6, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
      onMouseLeave={() => { x.set(0.5); y.set(0.5) }}
      onTouchMove={(e) => handleMove(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchEnd={() => { x.set(0.5); y.set(0.5) }}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1000,
        transformStyle: "preserve-3d",
      }}
    >
      {/* Decorative frame */}
      <motion.div 
        className="absolute inset-0 border border-border/30 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ transform: "translateZ(-10px)" }}
      />
      
      {/* Animated corner brackets */}
      <motion.div
        className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-primary/50"
        initial={{ opacity: 0, scale: 0 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
        transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-primary/50"
        initial={{ opacity: 0, scale: 0 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
        transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
      />
      
      <div className="relative z-10" style={{ transform: "translateZ(30px)" }}>
        <motion.div 
          className="text-4xl md:text-5xl lg:text-6xl font-serif text-primary mb-2"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
        >
          {typeof stat.value === 'number' ? (
            <AnimatedCounter value={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
          ) : (
            <span>{stat.value}</span>
          )}
        </motion.div>
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.5 + index * 0.15 }}
        style={{ transform: "translateZ(20px)" }}
      >
        <h3 className="text-lg font-medium text-foreground mb-1">{stat.label}</h3>
        <p className="text-sm text-muted-foreground">{stat.description}</p>
      </motion.div>

      {/* Animated underline */}
      <motion.div
        className="h-px bg-primary/30 mx-auto mt-6 max-w-[100px]"
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.8, delay: 0.6 + index * 0.15 }}
      />
      
      {/* Background shimmer */}
      <motion.div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        initial={{ opacity: 0 }}
      >
        <motion.div
          className="absolute inset-0 -translate-x-full"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)",
          }}
          animate={isInView ? { translateX: ["100%", "-100%"] } : {}}
          transition={{ duration: 3, delay: 1 + index * 0.2, repeat: Infinity, repeatDelay: 5 }}
        />
      </motion.div>
    </motion.div>
  )
}

export function StatsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="relative py-24 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
      
      {/* Animated SVG lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <motion.line
          x1="0" y1="50%" x2="100%" y2="50%"
          stroke="currentColor"
          strokeWidth="1"
          className="text-border"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
        {[0.25, 0.5, 0.75].map((pos, i) => (
          <motion.line
            key={i}
            x1={`${pos * 100}%`} y1="30%" x2={`${pos * 100}%`} y2="70%"
            stroke="currentColor"
            strokeWidth="1"
            className="text-border hidden md:block"
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 1, delay: 0.5 + i * 0.2, ease: "easeInOut" }}
          />
        ))}
      </svg>

      {/* Mobile decorative orbs */}
      <motion.div
        className="absolute top-10 left-5 w-20 h-20 rounded-full md:hidden"
        style={{
          background: "radial-gradient(circle, rgba(var(--primary-rgb), 0.1) 0%, transparent 70%)",
        }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-10 right-5 w-16 h-16 rounded-full md:hidden"
        style={{
          background: "radial-gradient(circle, rgba(var(--primary-rgb), 0.1) 0%, transparent 70%)",
        }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 5, repeat: Infinity, delay: 1 }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-4">
          {stats.map((stat, index) => (
            <StatCard key={index} stat={stat} index={index} />
          ))}
        </div>
      </div>

      {/* Floating elements */}
      <motion.div
        className="absolute top-1/4 left-10 w-16 h-16 border border-primary/10 rounded-full hidden md:block"
        animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute bottom-1/4 right-20 w-4 h-4 bg-primary/10 rotate-45 hidden md:block"
        animate={{ y: [-20, 20, -20], rotate: [45, 90, 45] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
    </section>
  )
}
