"use client"

import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import { Home, Key, TrendingUp, Users, ChevronLeft, ChevronRight } from "lucide-react"
import { LineReveal } from "./text-reveal"

const services = [
  {
    icon: Home,
    title: "Property Acquisition",
    description: "Expert guidance in finding and securing your dream residence, with access to exclusive off-market listings.",
    number: "01",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"
  },
  {
    icon: TrendingUp,
    title: "Investment Advisory",
    description: "Strategic real estate investment consulting to maximize returns and build your luxury property portfolio.",
    number: "02",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80"
  },
  {
    icon: Key,
    title: "Seller Representation",
    description: "Premium marketing and negotiation services to achieve the highest value for your exceptional property.",
    number: "03",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80"
  },
  {
    icon: Users,
    title: "Concierge Services",
    description: "Comprehensive lifestyle management including property management, renovation, and relocation assistance.",
    number: "04",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80"
  },
]

function ServiceCard({ service, index, isMobile = false }: { service: typeof services[0], index: number, isMobile?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0.5)
  const y = useMotionValue(0.5)
  
  const springConfig = { damping: 20, stiffness: 300 }
  const xSpring = useSpring(x, springConfig)
  const ySpring = useSpring(y, springConfig)
  
  const rotateX = useTransform(ySpring, [0, 1], [12, -12])
  const rotateY = useTransform(xSpring, [0, 1], [-12, 12])

  const handleMove = (clientX: number, clientY: number) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    x.set((clientX - rect.left) / rect.width)
    y.set((clientY - rect.top) / rect.height)
  }

  const handleLeave = () => {
    x.set(0.5)
    y.set(0.5)
  }

  const Icon = service.icon

  return (
    <motion.div
      ref={ref}
      onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
      onMouseLeave={handleLeave}
      onTouchMove={(e) => handleMove(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchEnd={handleLeave}
      initial={{ opacity: 0, y: 60, rotateX: 20 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        delay: isMobile ? 0 : index * 0.15, 
        duration: 0.8, 
        ease: [0.22, 1, 0.36, 1] 
      }}
      style={{
        rotateX: isMobile ? rotateX : rotateX,
        rotateY: isMobile ? rotateY : rotateY,
        transformPerspective: 1200,
        transformStyle: "preserve-3d",
      }}
      className={`h-full ${isMobile ? 'w-[300px] flex-shrink-0' : ''}`}
    >
      <motion.div
        className="group relative bg-card h-full border border-border/50 overflow-hidden"
        whileHover={{ borderColor: "var(--primary)", y: -8 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.3 }}
      >
        {/* Image with effects */}
        <div className="relative h-48 overflow-hidden">
          <motion.img
            src={service.image}
            alt={service.title}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.6 }}
          />
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
          
          {/* Animated frame */}
          <motion.div className="absolute inset-2 border border-background/20 pointer-events-none">
            <motion.div 
              className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div 
              className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            />
          </motion.div>
          
          {/* Scan line */}
          <motion.div
            className="absolute inset-0 pointer-events-none overflow-hidden"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
          >
            <motion.div
              className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/60 to-transparent"
              animate={{ top: ["0%", "100%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
          
          {/* Number badge */}
          <motion.div
            className="absolute top-4 right-4 w-12 h-12 bg-foreground/90 flex items-center justify-center"
            style={{ transform: "translateZ(40px)" }}
          >
            <span className="text-background font-serif text-lg">{service.number}</span>
          </motion.div>
        </div>

        <div className="p-6 lg:p-8 relative">
          {/* Background number with 3D depth */}
          <motion.span 
            className="absolute -top-8 -right-4 text-[8rem] font-serif text-foreground/[0.03] pointer-events-none select-none hidden md:block"
            style={{ transform: "translateZ(-20px)" }}
          >
            {service.number}
          </motion.span>
          
          {/* Icon with hover animation */}
          <motion.div
            className="relative w-14 h-14 mb-6 flex items-center justify-center"
            whileHover={{ scale: 1.1, rotate: 5 }}
            style={{ transform: "translateZ(30px)" }}
          >
            <motion.div 
              className="absolute inset-0 bg-primary/10"
              whileHover={{ backgroundColor: "rgba(var(--primary), 0.2)", rotate: 45 }}
              transition={{ duration: 0.4 }}
            />
            <Icon className="w-6 h-6 text-primary relative z-10" />
          </motion.div>
          
          {/* Content with depth */}
          <motion.div style={{ transform: "translateZ(20px)" }}>
            <h3 className="text-xl md:text-2xl font-serif text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
              {service.title}
            </h3>
            <p className="text-muted-foreground font-sans text-sm leading-relaxed">
              {service.description}
            </p>
          </motion.div>
          
          {/* Animated bottom line */}
          <motion.div
            className="absolute bottom-0 left-0 h-1 bg-primary"
            initial={{ width: "0%" }}
            whileHover={{ width: "100%" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />
          
          {/* Corner accents */}
          <motion.div
            className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-transparent group-hover:border-primary/40 transition-all duration-500"
            style={{ transform: "translateZ(10px)" }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-transparent group-hover:border-primary/40 transition-all duration-500"
            style={{ transform: "translateZ(10px)" }}
          />
        </div>
      </motion.div>
    </motion.div>
  )
}

// Mobile horizontal scroll carousel
function MobileServicesCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScroll = () => {
    if (!scrollRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
  }

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    const amount = 320
    scrollRef.current.scrollBy({ 
      left: direction === 'left' ? -amount : amount, 
      behavior: 'smooth' 
    })
  }

  useEffect(() => {
    const el = scrollRef.current
    if (el) {
      el.addEventListener('scroll', checkScroll)
      return () => el.removeEventListener('scroll', checkScroll)
    }
  }, [])

  return (
    <div className="md:hidden relative">
      {/* Navigation arrows */}
      <div className="flex justify-end gap-2 mb-4 px-6">
        <motion.button
          onClick={() => scroll('left')}
          className={`w-10 h-10 border flex items-center justify-center transition-colors ${
            canScrollLeft ? 'border-border hover:border-primary' : 'border-border/30 opacity-50'
          }`}
          whileTap={{ scale: 0.9 }}
          disabled={!canScrollLeft}
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.button>
        <motion.button
          onClick={() => scroll('right')}
          className={`w-10 h-10 border flex items-center justify-center transition-colors ${
            canScrollRight ? 'border-border hover:border-primary' : 'border-border/30 opacity-50'
          }`}
          whileTap={{ scale: 0.9 }}
          disabled={!canScrollRight}
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide px-6 pb-4"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {services.map((service, index) => (
          <div key={service.title} style={{ scrollSnapAlign: 'start' }}>
            <ServiceCard service={service} index={index} isMobile />
          </div>
        ))}
      </div>
      
      {/* Progress dots */}
      <div className="flex justify-center gap-2 mt-4">
        {services.map((_, idx) => (
          <div
            key={idx}
            className="w-2 h-2 rounded-full bg-border"
          />
        ))}
      </div>
    </div>
  )
}

export function ServicesSection() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })
  
  const x = useTransform(scrollYProgress, [0, 1], [100, -100])
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 180])

  return (
    <section id="services" ref={ref} className="py-24 md:py-32 px-0 md:px-6 lg:px-12 bg-secondary relative overflow-hidden">
      {/* Animated background text */}
      <motion.div
        className="absolute bottom-10 left-0 right-0 pointer-events-none overflow-hidden hidden md:block"
        style={{ x }}
      >
        <span className="text-[12vw] font-serif text-foreground/[0.02] whitespace-nowrap">
          SERVICES SERVICES SERVICES SERVICES
        </span>
      </motion.div>
      
      {/* Floating geometric shapes */}
      <motion.div
        className="absolute top-20 right-20 w-32 h-32 border border-primary/10 hidden md:block"
        style={{ rotate }}
      />
      <motion.div
        className="absolute bottom-40 left-10 w-4 h-4 bg-primary/20 rounded-full hidden md:block"
        animate={{ 
          scale: [1, 2, 1],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-12 md:mb-20 px-6">
          <motion.span
            className="text-primary text-sm tracking-[0.3em] uppercase font-sans mb-6 block"
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
          >
            What We Offer
          </motion.span>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-foreground">
            <LineReveal>Exceptional</LineReveal>
            <LineReveal delay={0.1}>Services</LineReveal>
          </h2>
          
          <motion.div
            className="w-20 h-px bg-primary mx-auto mt-8"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
          />
        </div>
        
        {/* Mobile carousel */}
        <MobileServicesCarousel />
        
        {/* Desktop grid */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-2 gap-8 px-6">
          {services.map((service, index) => (
            <ServiceCard key={service.title} service={service} index={index} />
          ))}
        </div>
      </div>
      
      {/* Bottom decorative line */}
      <motion.div
        className="absolute bottom-0 left-1/4 right-1/4 h-px hidden md:block"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
        style={{
          background: "linear-gradient(90deg, transparent, var(--primary), transparent)",
          opacity: 0.3,
        }}
      />
    </section>
  )
}
