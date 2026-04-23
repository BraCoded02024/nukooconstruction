"use client"

import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import { TextMarquee } from "./marquee"
import { ArrowRight, ArrowLeft } from "lucide-react"

const galleryImages = [
  {
    src: "/images/featured1.jpeg",
    title: "Modern Architecture",
    location: "Ghana-Oyarifa",
  },
  {
    src: "/images/featured2.jpeg",
    title: "Luxury Interior",
    location: "Ghana",
  },
  // {
  //   src: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1920&q=100",
  //   title: "Waterfront Living",
  //   location: "Miami Beach"
  // },
  // {
  //   src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=100",
  //   title: "Contemporary Design",
  //   location: "Malibu"
  // },
  // {
  //   src: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1920&q=100",
  //   title: "Estate Living",
  //   location: "Hamptons"
  // }
]

export function GallerySection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"])
  const springX = useSpring(x, { damping: 30, stiffness: 100 })
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % galleryImages.length)
  }
  
  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)
  }

  return (
    <section ref={containerRef} className="relative py-20 md:py-32 overflow-hidden bg-foreground">
      {/* Background text marquee */}
      <div className="absolute inset-0 flex items-center opacity-[0.03]">
        <TextMarquee 
          text="LUXURY LIVING" 
          speed={30}
          textClassName="text-[15vw] md:text-[20vw] font-serif text-background"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 mb-10 md:mb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <span className="text-xs md:text-sm tracking-[0.3em] text-primary uppercase mb-3 md:mb-4 block">
            Portfolio
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-background mb-4 md:mb-6">
            Featured Estates
          </h2>
          <p className="text-background/60 max-w-xl text-sm md:text-base">
            Explore our curated collection of the world&apos;s most exceptional properties.
          </p>
        </motion.div>
      </div>

      {/* Mobile Carousel View */}
      {isMobile && (
        <div className="relative z-10 px-4">
          <motion.div
            className="relative aspect-[3/4] overflow-hidden rounded-sm cursor-grab active:cursor-grabbing"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(e, info) => {
              if (info.offset.x < -50) nextSlide()
              else if (info.offset.x > 50) prevSlide()
            }}
          >
            {/* Animated frame borders */}
            <motion.div 
              className="absolute -inset-3 pointer-events-none z-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <motion.div 
                className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-primary/50"
                animate={{ 
                  borderColor: ["rgba(196, 133, 77, 0.5)", "rgba(196, 133, 77, 0.8)", "rgba(196, 133, 77, 0.5)"]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <motion.div 
                className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 border-primary/50"
                animate={{ 
                  borderColor: ["rgba(196, 133, 77, 0.5)", "rgba(196, 133, 77, 0.8)", "rgba(196, 133, 77, 0.5)"]
                }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
              />
              <motion.div 
                className="absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2 border-primary/50"
                animate={{ 
                  borderColor: ["rgba(196, 133, 77, 0.5)", "rgba(196, 133, 77, 0.8)", "rgba(196, 133, 77, 0.5)"]
                }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
              />
              <motion.div 
                className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-primary/50"
                animate={{ 
                  borderColor: ["rgba(196, 133, 77, 0.5)", "rgba(196, 133, 77, 0.8)", "rgba(196, 133, 77, 0.5)"]
                }}
                transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
              />
            </motion.div>
            
            {/* Animated scan line */}
            <motion.div
              className="absolute inset-0 z-10 pointer-events-none"
              style={{
                background: "linear-gradient(180deg, transparent 0%, rgba(196, 133, 77, 0.15) 50%, transparent 100%)",
                backgroundSize: "100% 30px",
              }}
              animate={{ y: ["-100%", "200%"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Images with crossfade */}
            {galleryImages.map((image, index) => (
              <motion.div
                key={index}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ 
                  opacity: activeIndex === index ? 1 : 0,
                  scale: activeIndex === index ? 1 : 1.1,
                }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <Image
                  src={image.src}
                  alt={image.title}
                  fill
                  className="object-cover"
                  quality={100}
                  sizes="100vw"
                />
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/30 to-transparent" />
              </motion.div>
            ))}
            
            {/* Active image content */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 p-6 z-10"
              key={activeIndex}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.span 
                className="text-primary text-xs tracking-wider uppercase block mb-2"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {galleryImages[activeIndex].location}
              </motion.span>
              <motion.h3 
                className="font-serif text-2xl text-background"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {galleryImages[activeIndex].title}
              </motion.h3>
              
              {/* Animated line */}
              <motion.div
                className="h-px bg-primary/50 mt-4"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                style={{ originX: 0 }}
              />
            </motion.div>
            
            {/* Index number */}
            <motion.div 
              className="absolute top-4 right-4 z-10"
              key={`index-${activeIndex}`}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring" }}
            >
              <span className="font-serif text-5xl text-background/20">
                {String(activeIndex + 1).padStart(2, '0')}
              </span>
            </motion.div>
            
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 pointer-events-none z-10"
              style={{
                background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%)",
              }}
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 2 }}
            />
          </motion.div>
          
          {/* Navigation */}
          <div className="flex items-center justify-between mt-6">
            <motion.button
              onClick={prevSlide}
              className="w-12 h-12 rounded-full border border-background/20 flex items-center justify-center text-background"
              whileTap={{ scale: 0.9 }}
              whileHover={{ borderColor: "rgba(255,255,255,0.5)" }}
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
            
            {/* Dots indicator */}
            <div className="flex gap-2">
              {galleryImages.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className="w-2 h-2 rounded-full"
                  animate={{
                    backgroundColor: activeIndex === index ? "rgba(196, 133, 77, 1)" : "rgba(255, 255, 255, 0.3)",
                    scale: activeIndex === index ? 1.2 : 1,
                  }}
                  whileTap={{ scale: 0.8 }}
                />
              ))}
            </div>
            
            <motion.button
              onClick={nextSlide}
              className="w-12 h-12 rounded-full border border-background/20 flex items-center justify-center text-background"
              whileTap={{ scale: 0.9 }}
              whileHover={{ borderColor: "rgba(255,255,255,0.5)" }}
            >
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
          
          {/* Swipe hint */}
          <motion.p
            className="text-center text-background/40 text-xs mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 3, repeat: 2, delay: 1 }}
          >
            Swipe or tap arrows to explore
          </motion.p>
        </div>
      )}

      {/* Desktop Horizontal scroll gallery */}
      {!isMobile && (
        <motion.div 
          style={{ x: springX }}
          className="flex gap-8 pl-6 relative z-10"
        >
          {galleryImages.map((image, index) => (
            <motion.div
              key={index}
              className="relative flex-shrink-0 w-[40vw] aspect-[4/3] group cursor-pointer"
              initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
              whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              style={{ transformPerspective: 1200 }}
            >
              {/* Animated frame */}
              <motion.div 
                className="absolute -inset-4 pointer-events-none"
              >
                <motion.div 
                  className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary/40"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  viewport={{ once: true }}
                />
                <motion.div 
                  className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary/40"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  viewport={{ once: true }}
                />
              </motion.div>
              
              {/* Image container */}
              <div className="relative w-full h-full overflow-hidden rounded-sm">
                <motion.div
                  className="absolute inset-0"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <Image
                    src={image.src}
                    alt={image.title}
                    fill
                    className="object-cover"
                    quality={100}
                    sizes="40vw"
                  />
                </motion.div>
                
                {/* Overlay */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent"
                  initial={{ opacity: 0.5 }}
                  whileHover={{ opacity: 0.8 }}
                  transition={{ duration: 0.3 }}
                />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    viewport={{ once: true }}
                  >
                    <span className="text-primary text-sm tracking-wider uppercase">
                      {image.location}
                    </span>
                    <h3 className="font-serif text-2xl md:text-3xl text-background mt-2">
                      {image.title}
                    </h3>
                  </motion.div>

                  {/* Animated line */}
                  <motion.div
                    className="h-px bg-primary/50 mt-6"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    viewport={{ once: true }}
                    style={{ originX: 0 }}
                  />
                </div>

                {/* Index number */}
                <div className="absolute top-6 right-6">
                  <span className="font-serif text-6xl text-background/10">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Floating elements */}
      <motion.div
        className="absolute top-1/4 right-10 md:right-20 w-16 md:w-32 h-16 md:h-32 border border-primary/10 rotate-45 pointer-events-none"
        animate={{ rotate: [45, 90, 45], scale: [1, 0.9, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 left-4 md:left-10 w-2 h-2 bg-primary/30 rounded-full pointer-events-none"
        animate={{ y: [-30, 30, -30], opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
    </section>
  )
}
