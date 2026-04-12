"use client"

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import { MagneticButton } from "./magnetic-button"

const navItems = [
  { name: "Properties", href: "/#properties" },
  { name: "About", href: "/#about" },
  { name: "Services", href: "/#services" },
  { name: "Contact", href: "/#contact" },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { scrollY } = useScroll()
  
  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    ["rgba(0,0,0,0)", "rgba(255,255,255,0.95)"]
  )
  
  const backdropBlur = useTransform(
    scrollY,
    [0, 100],
    ["blur(0px)", "blur(10px)"]
  )

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (latest) => {
      setIsScrolled(latest > 100)
    })
    return () => unsubscribe()
  }, [scrollY])

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 px-6 lg:px-12"
        style={{ backgroundColor, backdropFilter: backdropBlur }}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <nav className="flex items-center justify-between py-4 md:py-6">
          {/* Logo with hover effect */}
          <motion.a
            href="/"
            className="relative z-10 flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <img 
              src="/nukoo.png" 
              alt="Nukoo Construction & Properties" 
              className="h-10 md:h-12 w-auto object-contain transition-all duration-300"
            />
            <span className={`font-serif text-lg md:text-xl tracking-wider transition-colors duration-300 ${
              isOpen || isScrolled ? "text-foreground" : "text-background"
            }`}>
              NUKOO
            </span>
          </motion.a>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-12">
            {navItems.map((item, index) => (
              <motion.a
                key={item.name}
                href={item.href}
                className={`relative text-sm tracking-widest uppercase font-sans group ${
                  isScrolled ? "text-foreground" : "text-background"
                }`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.2 }}
                whileHover={{ y: -2 }}
              >
                {item.name}
                <motion.span
                  className="absolute -bottom-2 left-0 w-full h-[2px] bg-primary origin-left"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <motion.span
                  className="absolute -right-2 -top-1 w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100"
                  transition={{ duration: 0.2 }}
                />
              </motion.a>
            ))}
          </div>
          
          {/* CTA Button */}
          <div className="hidden lg:block">
            <MagneticButton 
              onClick={() => {
                if (window.location.pathname === '/') {
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
                } else {
                  window.location.href = '/#contact'
                }
              }}
              className={`px-6 py-3 text-xs tracking-widest uppercase font-sans border transition-all duration-300 ${
                isScrolled 
                  ? "border-foreground text-foreground hover:bg-foreground hover:text-background" 
                  : "border-background/50 text-background hover:bg-background/10"
              }`}
            >
              Book Consultation
            </MagneticButton>
          </div>
          
          {/* Mobile Menu Button */}
          <motion.button
            className={`lg:hidden relative z-50 w-12 h-12 flex items-center justify-center ${
              isOpen ? "text-foreground" : isScrolled ? "text-foreground" : "text-background"
            }`}
            onClick={() => setIsOpen(!isOpen)}
            whileTap={{ scale: 0.9 }}
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-6 h-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col gap-1.5"
                >
                  <motion.span 
                    className="w-6 h-0.5 bg-current block"
                    whileHover={{ width: 24 }}
                  />
                  <motion.span 
                    className="w-4 h-0.5 bg-current block"
                    whileHover={{ width: 24 }}
                  />
                  <motion.span 
                    className="w-5 h-0.5 bg-current block"
                    whileHover={{ width: 24 }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </nav>
      </motion.header>
      
      {/* Mobile Menu with advanced animation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Animated background reveal */}
            <motion.div
              className="absolute inset-0 bg-background"
              initial={{ clipPath: "circle(0% at calc(100% - 30px) 30px)" }}
              animate={{ clipPath: "circle(150% at calc(100% - 30px) 30px)" }}
              exit={{ clipPath: "circle(0% at calc(100% - 30px) 30px)" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            />
            
            {/* Animated grid pattern */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.03 }}
              exit={{ opacity: 0 }}
            >
              <svg className="w-full h-full">
                <pattern id="mobileNavGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#mobileNavGrid)" />
              </svg>
            </motion.div>
            
            {/* Animated lines background */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute h-px bg-border/30 w-full"
                  style={{ top: `${15 + i * 14}%` }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  exit={{ scaleX: 0 }}
                  transition={{ delay: 0.2 + i * 0.05, duration: 0.5 }}
                />
              ))}
            </motion.div>
            
            {/* Floating orbs */}
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full pointer-events-none"
                style={{
                  width: 80 + i * 30,
                  height: 80 + i * 30,
                  left: `${5 + i * 25}%`,
                  top: `${20 + (i % 2) * 50}%`,
                  background: `radial-gradient(circle, rgba(var(--primary-rgb), ${0.05 + i * 0.02}) 0%, transparent 70%)`,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: 1, 
                  opacity: 1,
                  y: [0, -20, 0],
                }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{
                  scale: { delay: 0.3 + i * 0.1 },
                  y: { duration: 4 + i, repeat: Infinity, ease: "easeInOut" },
                }}
              />
            ))}
            
            <div className="relative h-full flex flex-col items-center justify-center gap-6 px-6">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  className="text-4xl md:text-5xl font-serif text-foreground relative overflow-hidden block"
                  initial={{ opacity: 0, y: 60, rotateX: -90 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  transition={{ 
                    delay: 0.2 + index * 0.1,
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  onClick={() => setIsOpen(false)}
                  whileHover={{ x: 20, color: "var(--primary)" }}
                  whileTap={{ scale: 0.95 }}
                  style={{ 
                    transformStyle: "preserve-3d",
                    transformPerspective: 1000,
                  }}
                >
                  <motion.span 
                    className="text-primary/40 text-base mr-4 font-sans inline-block"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    0{index + 1}
                  </motion.span>
                  {item.name}
                  
                  {/* Underline on tap */}
                  <motion.span
                    className="absolute bottom-0 left-0 h-0.5 bg-primary"
                    initial={{ width: 0 }}
                    whileTap={{ width: "100%" }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.a>
              ))}
              
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-8"
              >
                <MagneticButton 
                  className="px-10 py-4 bg-foreground text-background text-sm tracking-widest uppercase font-sans relative overflow-hidden"
                  onClick={() => {
                    setIsOpen(false)
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  <span className="relative z-10">Book Consultation</span>
                  <motion.div
                    className="absolute inset-0 bg-primary"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </MagneticButton>
              </motion.div>
              
              {/* Decorative corner elements */}
              <motion.div
                className="absolute bottom-16 left-8 w-16 h-16 border-l-2 border-b-2 border-foreground/10"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
              />
              <motion.div
                className="absolute top-28 right-8 w-16 h-16 border-r-2 border-t-2 border-foreground/10"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
              />
              
              {/* Bottom decorative line */}
              <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <motion.div 
                  className="w-8 h-px bg-foreground/20"
                  animate={{ scaleX: [1, 1.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-xs text-foreground/40 font-sans tracking-widest">LUXURY ESTATES</span>
                <motion.div 
                  className="w-8 h-px bg-foreground/20"
                  animate={{ scaleX: [1, 1.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
