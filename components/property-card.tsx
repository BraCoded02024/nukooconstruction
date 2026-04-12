"use client"

import { motion, useMotionValue, useSpring, useTransform, useInView, useAnimation } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import { MapPin, Maximize, BedDouble, Bath, ArrowUpRight } from "lucide-react"
import Image from "next/image"

interface PropertyCardProps {
  property: {
    id: number
    title: string
    location: string
    price: string
    images: string[]
    beds?: number | null
    baths?: number | null
    sqft: string
  }
  index: number
}

export function PropertyCard({ property, index }: PropertyCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  const controls = useAnimation()
  const [isMobile, setIsMobile] = useState(false)
  
  const x = useMotionValue(0.5)
  const y = useMotionValue(0.5)
  
  const springConfig = { damping: 25, stiffness: 400 }
  const xSpring = useSpring(x, springConfig)
  const ySpring = useSpring(y, springConfig)
  
  const rotateX = useTransform(ySpring, [0, 1], [20, -20])
  const rotateY = useTransform(xSpring, [0, 1], [-20, 20])
  const imageScale = useTransform(ySpring, [0, 0.5, 1], [1.15, 1, 1.15])
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Device orientation for mobile 3D tilt
  useEffect(() => {
    if (!isMobile) return

    const handleOrientation = (e: DeviceOrientationEvent) => {
      const gamma = e.gamma || 0 // Left-right tilt (-90 to 90)
      const beta = e.beta || 0 // Front-back tilt (-180 to 180)
      
      // Normalize to 0-1 range for motion values
      // We use a smaller range for subtler effect
      const nx = (gamma + 30) / 60
      const ny = (beta - 30) / 60
      
      x.set(Math.max(0, Math.min(1, nx)))
      y.set(Math.max(0, Math.min(1, ny)))
    }

    if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      window.addEventListener('deviceorientation', handleOrientation)
    }
    return () => window.removeEventListener('deviceorientation', handleOrientation)
  }, [isMobile, x, y])
  
  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current || isMobile) return
    const rect = ref.current.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width)
    y.set((e.clientY - rect.top) / rect.height)
  }

  const handleMouseLeave = () => {
    x.set(0.5)
    y.set(0.5)
  }
  
  // Mobile touch interaction
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!ref.current) return
    const touch = e.touches[0]
    const rect = ref.current.getBoundingClientRect()
    x.set((touch.clientX - rect.left) / rect.width)
    y.set((touch.clientY - rect.top) / rect.height)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseLeave}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { 
          opacity: 0, 
          y: 80, 
          rotateX: 25,
          scale: 0.9,
          filter: "blur(10px)"
        },
        visible: { 
          opacity: 1, 
          y: 0, 
          rotateX: 0, 
          scale: 1, 
          filter: "none", 
          transition: {
            duration: 1,
            delay: index * 0.15,
            ease: [0.22, 1, 0.36, 1]
          }
        }
      }}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1200,
        transformStyle: "preserve-3d",
      }}
      className="group relative bg-card cursor-pointer"
      whileHover={{ scale: isMobile ? 1.02 : 1.05 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Animated frame borders */}
      <motion.div 
        className="absolute -inset-3 md:-inset-4 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 + index * 0.1 }}
      >
        {/* Top left corner */}
        <motion.div 
          className="absolute top-0 left-0 w-8 md:w-12 h-8 md:h-12 border-t-2 border-l-2 border-primary/40"
          initial={{ scale: 0, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : {}}
          transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
        />
        {/* Top right corner */}
        <motion.div 
          className="absolute top-0 right-0 w-8 md:w-12 h-8 md:h-12 border-t-2 border-r-2 border-primary/40"
          initial={{ scale: 0, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : {}}
          transition={{ delay: 0.4 + index * 0.1, type: "spring" }}
        />
        {/* Bottom left corner */}
        <motion.div 
          className="absolute bottom-0 left-0 w-8 md:w-12 h-8 md:h-12 border-b-2 border-l-2 border-primary/40"
          initial={{ scale: 0, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : {}}
          transition={{ delay: 0.5 + index * 0.1, type: "spring" }}
        />
        {/* Bottom right corner */}
        <motion.div 
          className="absolute bottom-0 right-0 w-8 md:w-12 h-8 md:h-12 border-b-2 border-r-2 border-primary/40"
          initial={{ scale: 0, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : {}}
          transition={{ delay: 0.6 + index * 0.1, type: "spring" }}
        />
      </motion.div>
      
      {/* Floating background frame with parallax */}
      <motion.div
        className="absolute -inset-6 md:-inset-8 border border-primary/10 -z-10 pointer-events-none"
        style={{ 
          transform: "translateZ(-50px)",
        }}
        animate={{
          rotate: [0, 1, 0, -1, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Image container with advanced effects */}
      <div className="relative aspect-[4/5] overflow-hidden">
        {/* Animated scan line effect for mobile */}
        <motion.div
          className="absolute inset-0 z-20 pointer-events-none md:hidden"
          style={{
            background: "linear-gradient(180deg, transparent 0%, rgba(196, 133, 77, 0.1) 50%, transparent 100%)",
            backgroundSize: "100% 20px",
          }}
          animate={{ y: ["-100%", "200%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Image with 3D depth and motion */}
        <motion.div
          className="relative w-full h-full"
          style={{ 
            scale: imageScale,
            transformStyle: "preserve-3d",
          }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.6 }}
        >
          <Image
            src={
              property.images && property.images.length > 0 
                ? (property.images[0].startsWith('http') 
                    ? property.images[0] 
                    : `${process.env.NEXT_PUBLIC_API_URL}${property.images[0]}`)
                : '/placeholder.jpg'
            }
            alt={property.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            quality={100}
            priority={index < 4}
          />
        </motion.div>
        
        {/* Animated gradient overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/40 to-transparent"
          initial={{ opacity: 0.3 }}
          whileHover={{ opacity: 0.7 }}
          transition={{ duration: 0.4 }}
        />
        
        {/* Glowing border effect on mobile */}
        <motion.div
          className="absolute inset-0 border-2 border-primary/0 md:hidden"
          animate={{
            borderColor: ["rgba(196, 133, 77, 0)", "rgba(196, 133, 77, 0.3)", "rgba(196, 133, 77, 0)"],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        
        {/* Price tag with slide animation */}
        <motion.div
          className="absolute top-4 right-4 bg-background/95 backdrop-blur-sm px-4 py-2 md:px-5 md:py-2.5"
          initial={{ x: 100, opacity: 0, rotateY: -30 }}
          animate={isInView ? { x: 0, opacity: 1, rotateY: 0 } : {}}
          transition={{ delay: 0.4 + index * 0.1, type: "spring" }}
          style={{ transformPerspective: 800 }}
        >
          <span className="text-foreground font-sans text-sm font-medium tracking-wide">{property.price}</span>
        </motion.div>
        
        {/* Mobile tap indicator */}
        <motion.div
          className="absolute bottom-20 left-1/2 -translate-x-1/2 md:hidden"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: [0, 1, 0], y: [10, 0, 10] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
        >
          <div className="px-3 py-1.5 bg-primary/80 backdrop-blur-sm rounded-full">
            <span className="text-xs text-primary-foreground font-sans">Tap for details</span>
          </div>
        </motion.div>
        
        {/* Hover content overlay - visible on mobile by default */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-background"
          initial={{ y: 0, opacity: 1 }}
          whileHover={{ y: 0, opacity: 1 }}
        >
          <motion.div 
            className="flex items-center gap-4 md:gap-6 text-xs md:text-sm font-sans mb-3 md:mb-4 flex-wrap"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5 + index * 0.1 }}
          >
            {property.beds !== null && property.beds !== undefined && (
              <motion.span 
                className="flex items-center gap-1.5 md:gap-2"
                whileHover={{ scale: 1.1 }}
              >
                <BedDouble className="w-3.5 h-3.5 md:w-4 md:h-4" /> {property.beds} Beds
              </motion.span>
            )}
            {property.baths !== null && property.baths !== undefined && (
              <motion.span 
                className="flex items-center gap-1.5 md:gap-2"
                whileHover={{ scale: 1.1 }}
              >
                <Bath className="w-3.5 h-3.5 md:w-4 md:h-4" /> {property.baths} Baths
              </motion.span>
            )}
            <motion.span 
              className="flex items-center gap-1.5 md:gap-2"
              whileHover={{ scale: 1.1 }}
            >
              <Maximize className="w-3.5 h-3.5 md:w-4 md:h-4" /> {property.sqft}
            </motion.span>
          </motion.div>
          
          <motion.button
            className="w-full py-2.5 md:py-3.5 border border-background/40 text-xs md:text-sm tracking-widest uppercase font-sans flex items-center justify-center gap-2 backdrop-blur-sm bg-background/10"
            whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.2)" }}
            whileTap={{ scale: 0.98 }}
          >
            View Property
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowUpRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </motion.span>
          </motion.button>
        </motion.div>
        
        {/* 3D shine/glare effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none hidden md:block"
          style={{
            background: `linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.1) 45%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 55%, transparent 60%)`,
            transform: `translateX(${useTransform(xSpring, [0, 1], [-100, 100]).get()}%)`,
          }}
        />
        
        {/* Mobile shimmer effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none md:hidden"
          style={{
            background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.05) 50%, transparent 60%)",
          }}
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        />
      </div>
      
      {/* Content below image with 3D depth */}
      <motion.div 
        className="p-4 md:p-6 relative"
        style={{ transform: "translateZ(30px)" }}
      >
        {/* Animated underline */}
        <motion.div
          className="absolute top-0 left-4 md:left-6 right-4 md:right-6 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ delay: 0.6 + index * 0.1, duration: 0.8 }}
        />
        
        <motion.h3
          className="font-serif text-lg md:text-xl mb-2 text-foreground"
          whileHover={{ x: 5, color: "var(--primary)" }}
          transition={{ duration: 0.3 }}
        >
          {property.title}
        </motion.h3>
        
        <motion.div 
          className="flex items-center gap-2 text-muted-foreground"
          initial={{ opacity: 0, x: -10 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.7 + index * 0.1 }}
        >
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
          </motion.span>
          <span className="text-xs md:text-sm font-sans">{property.location}</span>
        </motion.div>
      </motion.div>
      
      {/* Floating index number with 3D depth */}
      <motion.span
        className="absolute top-4 md:top-6 left-4 md:left-6 text-5xl md:text-7xl font-serif text-foreground/5 pointer-events-none"
        style={{ transform: "translateZ(20px)" }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
      >
        0{index + 1}
      </motion.span>
      
      {/* Animated dots decoration */}
      <div className="absolute -right-2 top-1/4 flex flex-col gap-2 pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-primary/40"
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? { 
              opacity: [0.3, 0.8, 0.3], 
              scale: 1 
            } : {}}
            transition={{ 
              opacity: { duration: 2, repeat: Infinity, delay: i * 0.3 },
              scale: { delay: 0.5 + i * 0.1 }
            }}
          />
        ))}
      </div>
    </motion.div>
  )
}
