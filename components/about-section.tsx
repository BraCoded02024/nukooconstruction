"use client"

import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import { LineReveal } from "./text-reveal"
import Image from "next/image"

const stats = [
  { value: "57+", label: "Projects Completed" },
  { value: "$12B", label: "Total Value Delivered" },
  { value: "Proven", label: "Years Experience" },
  { value: "100%", label: "Client Commitment" },
]

export function AboutSection() {
  const ref = useRef(null)
  const imageRef = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })
  
  const imageY = useTransform(scrollYProgress, [0, 1], [50, -50])
  const textY = useTransform(scrollYProgress, [0, 1], [30, -30])
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.9, 1])
  const frameX = useTransform(scrollYProgress, [0, 1], [-15, 15])

  return (
    <section id="about" ref={ref} className="py-20 md:py-32 bg-foreground text-background overflow-hidden relative">
      {/* Animated background pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <motion.div
          className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
          animate={{ y: [-20, 0, -20] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 lg:gap-24 items-center">
          {/* Image side with 3D transform and enhanced frames */}
          <motion.div
            ref={imageRef}
            className="relative order-2 lg:order-1"
            style={{ 
              y: imageY, 
              scale: scale,
            }}
          >
            {/* Outer animated frame */}
            <motion.div
              className="absolute -inset-4 md:-inset-6 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5 }}
            >
              {/* Animated corner brackets */}
              <motion.div 
                className="absolute top-0 left-0 w-8 md:w-12 h-8 md:h-12 border-t-2 border-l-2 border-primary/50"
                initial={{ scale: 0, opacity: 0 }}
                animate={isInView ? { scale: 1, opacity: 1 } : {}}
                transition={{ delay: 0.6, type: "spring" }}
              />
              <motion.div 
                className="absolute top-0 right-0 w-8 md:w-12 h-8 md:h-12 border-t-2 border-r-2 border-primary/50"
                initial={{ scale: 0, opacity: 0 }}
                animate={isInView ? { scale: 1, opacity: 1 } : {}}
                transition={{ delay: 0.7, type: "spring" }}
              />
              <motion.div 
                className="absolute bottom-0 left-0 w-8 md:w-12 h-8 md:h-12 border-b-2 border-l-2 border-primary/50"
                initial={{ scale: 0, opacity: 0 }}
                animate={isInView ? { scale: 1, opacity: 1 } : {}}
                transition={{ delay: 0.8, type: "spring" }}
              />
              <motion.div 
                className="absolute bottom-0 right-0 w-8 md:w-12 h-8 md:h-12 border-b-2 border-r-2 border-primary/50"
                initial={{ scale: 0, opacity: 0 }}
                animate={isInView ? { scale: 1, opacity: 1 } : {}}
                transition={{ delay: 0.9, type: "spring" }}
              />
              
              {/* Animated border glow for mobile */}
              {isMobile && (
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(196, 133, 77, 0)",
                      "0 0 20px rgba(196, 133, 77, 0.3)",
                      "0 0 20px rgba(196, 133, 77, 0)",
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              )}
            </motion.div>
            
            <div className="relative aspect-[4/5] overflow-hidden">
              {/* Animated scan line for mobile */}
              {isMobile && (
                <motion.div
                  className="absolute inset-0 z-10 pointer-events-none"
                  style={{
                    background: "linear-gradient(180deg, transparent 0%, rgba(196, 133, 77, 0.15) 50%, transparent 100%)",
                    backgroundSize: "100% 30px",
                  }}
                  animate={{ y: ["-100%", "200%"] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                />
              )}
              
              <motion.div
                className="relative w-full h-full"
                initial={{ scale: 1.3, filter: "blur(10px)" }}
                animate={isInView ? { scale: 1, filter: "none" } : {}}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              >
                <Image
                  src="/profilenukoo.jpeg"
                  alt="Nukoo Construction & Properties"
                  fill
                  className="object-cover object-center"
                  quality={100}
                  priority
                />
              </motion.div>
              
              {/* Image overlay gradient */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-tr from-foreground/30 to-transparent"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.5 }}
              />
              
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)",
                }}
                initial={{ x: "-100%" }}
                animate={isInView ? { x: "200%" } : {}}
                transition={{ duration: 1.5, delay: 0.8 }}
              />
            </div>
            
            {/* Floating frame with parallax */}
            <motion.div
              className="absolute -top-4 md:-top-8 -right-4 md:-right-8 w-full h-full border border-primary/40 -z-10"
              style={{ x: frameX }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.4, duration: 0.8 }}
            />
            
            {/* Stats overlay card - enhanced for mobile */}
            <motion.div
              className="absolute -bottom-6 md:-bottom-12 -right-2 md:-right-12 lg:-right-24 bg-primary p-5 md:p-8 lg:p-12"
              initial={{ opacity: 0, y: 60, rotateY: -15 }}
              animate={isInView ? { opacity: 1, y: 0, rotateY: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformPerspective: 1000 }}
              whileHover={{ scale: 1.05, rotateY: 5 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Animated border for mobile */}
              <motion.div
                className="absolute inset-0 border-2 border-primary-foreground/20 md:hidden"
                animate={{
                  borderColor: ["rgba(255,255,255,0.2)", "rgba(255,255,255,0.5)", "rgba(255,255,255,0.2)"]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              
              <motion.span
                className="text-2xl md:text-3xl lg:text-4xl font-serif text-primary-foreground block uppercase leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.6 }}
              >
                Years of Excellence
              </motion.span>
            </motion.div>
            
            {/* Decorative dots */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 md:w-2 h-1.5 md:h-2 bg-primary/60 rounded-full"
                style={{
                  top: `${30 + i * 20}%`,
                  left: `${-12 - i * 5}px`,
                }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.4, 0.8, 0.4],
                }}
                transition={{
                  duration: 2 + i,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              />
            ))}
          </motion.div>
          
          {/* Content side */}
          <motion.div 
            className="order-1 lg:order-2"
            style={{ y: textY }}
          >
            <motion.span
              className="text-primary text-xs md:text-sm tracking-[0.3em] uppercase font-sans mb-4 md:mb-6 block"
              initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
            >
              Who We Are
            </motion.span>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-serif mb-6 md:mb-8">
              <LineReveal>Nukoo Construction</LineReveal>
              <LineReveal delay={0.1}>& Properties</LineReveal>
            </h2>
            
            <motion.div
              className="space-y-4 md:space-y-6 text-background/70 font-sans text-sm md:text-base"
              initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
              animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <p className="leading-relaxed font-serif text-lg md:text-xl text-primary/90 italic">
                &quot;When we focus on mutual success, everyone wins.&quot;
              </p>
              <p className="leading-relaxed">
                The flexibility to mobilize the right people to deliver unique solutions, an unwavering focus to delivering value to your business bottom line; and the capability to leverage innovation to meet emerging challenges and keep you at the fore. This is Nukoo Construction & Properties.
              </p>
              <p className="leading-relaxed">
                As a company, we collaborate and innovate to help our partners thrive. Our culture of ownership drives your success. Whether you are in the buildings, civil, or industrial market, partnering with Nukoo means you&apos;re gaining a proven, reliable and trusted full-service partner with mobile experts and seasoned professionals across Ghana and Africa.
              </p>
              <p className="leading-relaxed hidden md:block">
                From advanced digital construction technologies to innovative offsite modular manufacturing, to the cutting edge of sustainable construction, as well as the selling of lands, we lead the industry with years of experience. We leverage the expertise from this vast experience to help our clients and partners build lasting legacies.
              </p>
            </motion.div>
            
            {/* Stats grid with stagger animation - enhanced for mobile */}
            <motion.div
              className="grid grid-cols-2 gap-4 md:gap-8 mt-8 md:mt-12 pt-8 md:pt-12 border-t border-background/10"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5 }}
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30, rotateX: -15 }}
                  animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
                  transition={{ 
                    delay: 0.6 + index * 0.1,
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  whileHover={{ x: 10, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="cursor-default group relative"
                  style={{ transformPerspective: 800 }}
                >
                  {/* Mobile touch indicator */}
                  <motion.div
                    className="absolute -inset-2 border border-primary/0 group-active:border-primary/30 transition-colors md:hidden"
                  />
                  
                  <motion.span
                    className="text-2xl md:text-3xl lg:text-4xl font-serif text-primary block mb-1 md:mb-2 group-hover:text-accent transition-colors duration-300"
                  >
                    {stat.value}
                  </motion.span>
                  <span className="text-background/50 text-xs md:text-sm font-sans tracking-wider uppercase">
                    {stat.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      {/* Large rotating decoration */}
      <motion.div
        className="absolute -bottom-20 md:-bottom-40 -left-20 md:-left-40 w-40 md:w-80 h-40 md:h-80 border border-background/5 rounded-full pointer-events-none"
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      />
    </section>
  )
}
