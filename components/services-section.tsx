"use client"

import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import type { LucideIcon } from "lucide-react"
import { Home, Key, TrendingUp, Users, ChevronLeft, ChevronRight, Hammer, Paintbrush, LayoutGrid } from "lucide-react"
import Image from "next/image"
import { LineReveal } from "./text-reveal"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export type ServiceItem = {
  icon: LucideIcon
  title: string
  description: string
  /** Longer copy shown in the detail dialog; falls back to description if omitted */
  details?: string
  number: string
  image: string
}

const services: ServiceItem[] = [
  {
    icon: Home,
    title: "Property Building",
    description: "Expert in building of properties, from start to finish.",
    details:
      "We manage new builds and major structural work end to end—foundations, block work, structural shells, and handover-ready finishes. Our team coordinates materials, safety, and timelines so your project stays on budget without cutting corners.",
    number: "01",
    image: "/images/services/building_properties.jpeg",
  },
  {
    icon: TrendingUp,
    title: "Roofing Works",
    description: "Strategic, quality and modern roofing works.",
    details:
      "From trusses and decking to insulation, waterproofing, and final roof coverings, we install systems suited to your climate and design. We focus on weather-tight details, drainage, and long-term durability so your roof protects the whole structure.",
    number: "02",
    image: "/images/services/roofing_works.jpeg",
  },
  {
    icon: Key,
    title: "Electrical Installation Works",
    description: "We handle all electrical installations",
    details:
      "Complete electrical fit-out for homes and commercial spaces: distribution, cabling, sockets, lighting, and compliance with safe practices. We plan loads and circuits clearly and test before sign-off so installations are reliable and maintainable.",
    number: "03",
    image: "/images/services/electrical_works.jpeg",
  },
  {
    icon: Users,
    title: "Plumbing Works",
    description: "We handle all plumbing installations and related works",
    details:
      "Water supply, waste and vent systems, fixtures, and leak-free connections—installed to practical layouts that are easy to service later. We coordinate with other trades to avoid clashes and keep wet areas performing as they should.",
    number: "04",
    image: "/images/services/plumbing_works.jpeg",
  },
  {
    icon: Hammer,
    title: "Landscaping Works",
    description: "We handle all landscaping works",
    details:
      "Grading, planting beds, paths, edging, and outdoor finishes that tie the building to its site. We balance drainage, usable space, and appearance so outdoor areas stay attractive and low-maintenance over time.",
    number: "05",
    image: "/images/services/landscaping_works.jpeg",
  },
  {
    icon: Paintbrush,
    title: "Road Construction Works",
    description: "All road construction works and related",
    details:
      "Subgrade preparation, base layers, compaction, and surfacing for access roads and small infrastructure. We pay attention to levels, stormwater, and edge details so surfaces hold up under traffic and weather.",
    number: "06",
    image: "/images/services/roadconstruction_works.jpeg",
  },
  {
    icon: LayoutGrid,
    title: "Land For Sale",
    description: "We have a variety of land for sale in different locations",
    details:
      "Plots in multiple locations to suit residential or investment goals. We can outline boundaries, access, and practical next steps so you understand what you are buying and how to move forward with planning or construction.",
    number: "07",
    image: "/images/services/landforsale_works.jpeg",
  },
]

function ServiceCard({
  service,
  index,
  isMobile = false,
  onOpenDetails,
}: {
  service: ServiceItem
  index: number
  isMobile?: boolean
  onOpenDetails?: () => void
}) {
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
        className="group relative bg-card h-full border border-border/50 overflow-hidden cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-secondary"
        whileHover={{ borderColor: "var(--primary)", y: -8 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.3 }}
        role="button"
        tabIndex={0}
        aria-label={`View full details: ${service.title}`}
        onClick={() => onOpenDetails?.()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            onOpenDetails?.()
          }
        }}
      >
        {/* Image: object-contain so the full photo is visible (letterboxing on wide shots) */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
          <motion.img
            src={service.image}
            alt={service.title}
            className="w-full h-full object-contain object-center"
            whileHover={{ scale: 1.03 }}
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
            <p className="mt-3 text-xs font-sans text-primary/90 tracking-wide">
              View full details
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
function MobileServicesCarousel({
  onSelectService,
}: {
  onSelectService: (service: ServiceItem) => void
}) {
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
          <div key={`${service.number}-${service.title}`} style={{ scrollSnapAlign: "start" }}>
            <ServiceCard
              service={service}
              index={index}
              isMobile
              onOpenDetails={() => onSelectService(service)}
            />
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
  const [detailService, setDetailService] = useState<ServiceItem | null>(null)
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
        <MobileServicesCarousel onSelectService={setDetailService} />

        {/* Desktop grid */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-2 gap-8 px-6">
          {services.map((service, index) => (
            <ServiceCard
              key={`${service.number}-${service.title}`}
              service={service}
              index={index}
              onOpenDetails={() => setDetailService(service)}
            />
          ))}
        </div>

        <Dialog open={detailService !== null} onOpenChange={(open) => !open && setDetailService(null)}>
          <DialogContent
            showCloseButton
            className="max-h-[min(90vh,900px)] max-w-[min(calc(100vw-2rem),56rem)] gap-0 overflow-y-auto overflow-x-hidden p-0 sm:max-w-[min(calc(100vw-2rem),56rem)]"
          >
            {detailService ? (
              <>
                <div className="relative h-[min(52vh,480px)] w-full bg-muted">
                  <Image
                    src={detailService.image}
                    alt={detailService.title}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 896px"
                  />
                </div>
                <div className="space-y-3 p-6 sm:p-8">
                  <DialogHeader className="text-left">
                    <p className="text-primary font-sans text-xs tracking-[0.25em]">{detailService.number}</p>
                    <DialogTitle className="font-serif text-2xl sm:text-3xl">{detailService.title}</DialogTitle>
                    <DialogDescription className="text-foreground/90 font-sans text-base leading-relaxed">
                      {detailService.details ?? detailService.description}
                    </DialogDescription>
                  </DialogHeader>
                </div>
              </>
            ) : null}
          </DialogContent>
        </Dialog>
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
