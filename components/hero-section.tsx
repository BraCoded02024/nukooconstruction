"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useScroll, useTransform, useSpring, MotionValue, useAnimation } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { MagneticButton } from "./magnetic-button"
import { TextReveal } from "./text-reveal"
import Image from "next/image"

function useParallax(value: MotionValue<number>, distance: number) {
  return useTransform(value, [0, 1], [-distance, distance])
}

export function HeroSection() {
  const ref = useRef(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isMobile, setIsMobile] = useState(false)
  const controls = useAnimation()
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  })
  
  const springConfig = { stiffness: 100, damping: 30 }
  const smoothProgress = useSpring(scrollYProgress, springConfig)
  
  const y = useParallax(smoothProgress, 300)
  const y2 = useParallax(smoothProgress, 150)
  const y3 = useParallax(smoothProgress, 75)
  const scale = useTransform(smoothProgress, [0, 1], [1, 1.2])
  const opacity = useTransform(smoothProgress, [0, 0.5], [1, 0])
  const textY = useTransform(smoothProgress, [0, 0.5], [0, -100])
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isMobile) return
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 30,
        y: (e.clientY / window.innerHeight - 0.5) * 30,
      })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [isMobile])
  
  // Device motion for mobile 3D effect
  useEffect(() => {
    if (!isMobile) return
    
    const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
      const gamma = e.gamma || 0 // Left-right tilt
      const beta = e.beta || 0 // Front-back tilt
      setMousePosition({
        x: gamma * 0.5,
        y: (beta - 45) * 0.3,
      })
    }
    
    if (typeof DeviceOrientationEvent !== 'undefined') {
      window.addEventListener('deviceorientation', handleDeviceOrientation)
    }
    
    return () => {
      window.removeEventListener('deviceorientation', handleDeviceOrientation)
    }
  }, [isMobile])
  
  // Start entrance animation
  useEffect(() => {
    controls.start("visible")
  }, [controls])

  return (
    <section ref={ref} className="relative h-[180vh] md:h-[200vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Animated background layers */}
        <motion.div 
          className="absolute inset-0 bg-foreground"
          style={{ scale }}
        >
          <motion.div
            className="absolute inset-0"
            style={{ y }}
          >
            <Image
              src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80"
              alt="Luxury home"
              fill
              className="object-cover"
              priority
              quality={100}
            />
          </motion.div>
          <div className="absolute inset-0 bg-foreground/50" />
        </motion.div>
        
        {/* Mobile-specific animated overlay effects */}
        <motion.div 
          className="absolute inset-0 md:hidden pointer-events-none"
          animate={{
            background: [
              "radial-gradient(circle at 30% 30%, rgba(196, 133, 77, 0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 70% 70%, rgba(196, 133, 77, 0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 30% 70%, rgba(196, 133, 77, 0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 70% 30%, rgba(196, 133, 77, 0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 30% 30%, rgba(196, 133, 77, 0.1) 0%, transparent 50%)",
            ]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Animated grid overlay */}
        <motion.div 
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{ opacity }}
        >
          <svg className="w-full h-full">
            <pattern id="heroGrid" width="60" height="60" patternUnits="userSpaceOnUse">
              <motion.path 
                d="M 60 0 L 0 0 0 60" 
                fill="none" 
                stroke="rgba(255,255,255,0.3)" 
                strokeWidth="0.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, delay: 1 }}
              />
            </pattern>
            <rect width="100%" height="100%" fill="url(#heroGrid)" />
          </svg>
        </motion.div>
        
        {/* 3D Floating geometric elements - responsive */}
        <motion.div
          className="absolute top-16 md:top-20 left-6 md:left-20 w-20 md:w-40 h-20 md:h-40 border border-background/20"
          style={{ 
            y: y2, 
            rotateX: mousePosition.y * 0.5,
            rotateY: mousePosition.x * 0.5,
            transformPerspective: 1000,
          }}
          animate={{
            rotate: [0, 90, 180, 270, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        
        <motion.div
          className="absolute bottom-32 md:bottom-40 right-6 md:right-32 w-16 md:w-24 h-16 md:h-24 bg-primary/30"
          style={{ 
            y: y3, 
            x: mousePosition.x * 2, 
            rotate: mousePosition.x * 2,
            rotateX: mousePosition.y,
            transformPerspective: 800,
          }}
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        
        {/* Floating orbs for mobile */}
        <motion.div
          className="absolute top-1/4 right-1/4 w-32 h-32 md:hidden rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(196, 133, 77, 0.2) 0%, transparent 70%)",
          }}
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 20, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <motion.div
          className="absolute bottom-1/3 left-1/4 w-40 h-40 md:hidden rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(196, 133, 77, 0.15) 0%, transparent 70%)",
          }}
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -15, 0],
            y: [0, 25, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        
        {/* Animated lines */}
        <motion.div
          className="absolute top-1/3 right-4 md:right-20 w-1 md:w-2 h-32 md:h-40 bg-gradient-to-b from-transparent via-background/40 to-transparent"
          style={{ y: isMobile ? 0 : y2 }}
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        
        {/* Floating dots constellation - responsive */}
        {[...Array(isMobile ? 6 : 8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 md:w-2 h-1.5 md:h-2 bg-primary/60 rounded-full"
            style={{
              top: `${15 + i * (isMobile ? 12 : 10)}%`,
              left: `${5 + Math.sin(i) * 10}%`,
            }}
            animate={{
              y: [-15, 15, -15],
              x: [-8, 8, -8],
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
        
        {/* Mobile-specific particle effect */}
        {isMobile && [...Array(12)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-primary/40 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
        
        {/* Animated SVG lines */}
        <motion.svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ opacity }}
        >
          <motion.line
            x1="10%"
            y1="20%"
            x2="25%"
            y2="85%"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 0.5 }}
          />
          <motion.line
            x1="90%"
            y1="10%"
            x2="75%"
            y2="90%"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 0.7 }}
          />
          <motion.circle
            cx="85%"
            cy="75%"
            r="80"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3, delay: 1 }}
          />
        </motion.svg>
        
        {/* Main content - enhanced mobile layout */}
        <motion.div 
          className="relative h-full flex flex-col items-center justify-center px-4 md:px-6"
          style={{ y: isMobile ? 0 : textY, opacity }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6 md:mb-8 overflow-hidden"
          >
            <motion.span 
              className="text-background/60 tracking-[0.25em] md:tracking-[0.4em] text-[10px] md:text-xs uppercase font-sans block text-center"
              initial={{ y: 30 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Exclusive Properties Worldwide
            </motion.span>
          </motion.div>
          
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-9xl font-serif text-background text-center leading-[1.1] mb-6 md:mb-8">
            <TextReveal delay={0.4}>Nukoo</TextReveal>
            <br />
            <span className="relative inline-block">
              <TextReveal delay={0.8}>Construction</TextReveal>
              <motion.span
                className="absolute -right-3 md:-right-6 top-0 w-2 md:w-4 h-2 md:h-4 bg-primary rounded-full"
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </span>
          </h1>
          
          <motion.p
            className="text-background/70 text-sm md:text-lg lg:text-xl max-w-md md:max-w-xl text-center mb-8 md:mb-12 font-sans px-4"
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            Discover architectural masterpieces and exclusive residences 
            in the world&apos;s most coveted addresses.
          </motion.p>
          
          <motion.div
            className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full sm:w-auto px-4 sm:px-0"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
          >
            <MagneticButton 
              onClick={() => {
                document.getElementById('properties')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="px-6 md:px-10 py-3.5 md:py-4 bg-background text-foreground font-sans text-xs md:text-sm tracking-wider uppercase w-full sm:w-auto text-center justify-center"
            >
              Explore Collection
            </MagneticButton>
            <MagneticButton 
              onClick={() => {
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="px-6 md:px-10 py-3.5 md:py-4 border border-background/30 text-background font-sans text-xs md:text-sm tracking-wider uppercase hover:bg-background/10 transition-colors w-full sm:w-auto text-center justify-center"
            >
              Schedule Viewing
            </MagneticButton>
          </motion.div>
        </motion.div>
        
        {/* Scroll indicator with enhanced animation */}
        <motion.div
          className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 md:gap-3"
          style={{ opacity }}
        >
          <motion.span 
            className="text-background/50 text-[10px] md:text-xs tracking-[0.2em] md:tracking-[0.3em] uppercase font-sans"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Scroll
          </motion.span>
          <motion.div
            className="relative"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="w-4 md:w-5 h-4 md:h-5 text-background/50" />
          </motion.div>
          {/* Animated line below scroll indicator for mobile */}
          <motion.div
            className="w-px h-8 md:h-12 bg-gradient-to-b from-background/30 to-transparent md:hidden"
            animate={{ scaleY: [0.5, 1, 0.5], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
        
        {/* Corner decorations with 3D effect - responsive */}
        <motion.div
          className="absolute top-4 md:top-8 left-4 md:left-8 w-12 md:w-24 h-12 md:h-24 border-l-2 border-t-2 border-background/20"
          initial={{ opacity: 0, scale: 0, rotate: -90 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, delay: 1.6, type: "spring" }}
          style={{ 
            rotateX: mousePosition.y * 0.3,
            rotateY: mousePosition.x * 0.3,
            transformPerspective: 500,
          }}
        />
        <motion.div
          className="absolute bottom-4 md:bottom-8 right-4 md:right-8 w-12 md:w-24 h-12 md:h-24 border-r-2 border-b-2 border-background/20"
          initial={{ opacity: 0, scale: 0, rotate: 90 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, delay: 1.8, type: "spring" }}
          style={{ 
            rotateX: -mousePosition.y * 0.3,
            rotateY: -mousePosition.x * 0.3,
            transformPerspective: 500,
          }}
        />
        
        {/* Horizontal animated line */}
        <motion.div
          className="absolute bottom-24 md:bottom-32 left-0 right-0 h-px"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 2 }}
          style={{ 
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
            originX: 0,
          }}
        />
        
        {/* Side navigation dots for mobile */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-3 md:hidden">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full border border-background/30"
              animate={{
                backgroundColor: i === 0 ? "rgba(255,255,255,0.5)" : "transparent",
              }}
              whileTap={{ scale: 1.5 }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
