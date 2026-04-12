"use client"

import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion"
import { useRef } from "react"
import { Instagram, Linkedin, Twitter, ArrowUp, MapPin, Phone } from "lucide-react"
import { MagneticButton } from "./magnetic-button"

const footerLinks = {
  properties: ["Featured", "New Listings", "Nukoo Construction", "Penthouses", "Waterfront"],
  services: ["Buying", "Selling", "Investment", "Consulting", "Property Management"],
  company: ["About Us", "Our Team", "Careers", "Press", "Contact"],
}

const socialLinks = [
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
]

function SocialButton({ social, index }: { social: typeof socialLinks[0], index: number }) {
  const ref = useRef<HTMLAnchorElement>(null)
  const x = useMotionValue(0.5)
  const y = useMotionValue(0.5)
  const springConfig = { damping: 25, stiffness: 300 }
  const xSpring = useSpring(x, springConfig)
  const ySpring = useSpring(y, springConfig)
  const rotateX = useTransform(ySpring, [0, 1], [10, -10])
  const rotateY = useTransform(xSpring, [0, 1], [-10, 10])

  const Icon = social.icon

  return (
    <motion.a
      ref={ref}
      href={social.href}
      className="w-12 h-12 border border-background/20 flex items-center justify-center relative overflow-hidden group"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2 + index * 0.1 }}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 600,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={(e) => {
        if (!ref.current) return
        const rect = ref.current.getBoundingClientRect()
        x.set((e.clientX - rect.left) / rect.width)
        y.set((e.clientY - rect.top) / rect.height)
      }}
      onMouseLeave={() => { x.set(0.5); y.set(0.5) }}
      onTouchMove={(e) => {
        if (!ref.current) return
        const rect = ref.current.getBoundingClientRect()
        x.set((e.touches[0].clientX - rect.left) / rect.width)
        y.set((e.touches[0].clientY - rect.top) / rect.height)
      }}
      onTouchEnd={() => { x.set(0.5); y.set(0.5) }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label={social.label}
    >
      <Icon className="w-4 h-4 relative z-10 group-hover:text-foreground transition-colors duration-300" style={{ transform: "translateZ(20px)" }} />
      <motion.div
        className="absolute inset-0 bg-background"
        initial={{ y: "100%" }}
        whileHover={{ y: "0%" }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary/30 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary/30 opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.a>
  )
}

export function Footer() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"]
  })
  
  const y = useTransform(scrollYProgress, [0, 1], [100, 0])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <footer ref={ref} className="bg-foreground text-background pt-20 md:pt-24 pb-8 relative overflow-hidden">
      {/* Large animated background text */}
      <motion.div
        className="absolute top-0 left-0 right-0 pointer-events-none overflow-hidden"
        style={{ y, opacity }}
      >
        <motion.span 
          className="text-[15vw] md:text-[20vw] font-serif text-background/[0.02] whitespace-nowrap block uppercase"
          animate={{ x: [0, -100, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          NUKOO NUKOO NUKOO
        </motion.span>
      </motion.div>
      
      {/* Floating decorative elements */}
      <motion.div
        className="absolute top-20 right-20 w-32 h-32 border border-background/5 pointer-events-none hidden md:block"
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Mobile floating orbs */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none md:hidden"
          style={{
            width: 60 + i * 20,
            height: 60 + i * 20,
            right: `${10 + i * 20}%`,
            top: `${20 + i * 25}%`,
            background: `radial-gradient(circle, rgba(var(--primary-rgb), ${0.05 + i * 0.02}) 0%, transparent 70%)`,
          }}
          animate={{
            y: [0, -15, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 5 + i,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Top section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-8 mb-12 md:mb-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <motion.a
              href="#"
              className="relative flex items-center gap-3 mb-4 md:mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
            >
              <img 
                src="/nukoo.png" 
                alt="Nukoo Construction & Properties" 
                className="h-10 md:h-12 w-auto object-contain"
              />
              <span className="font-serif text-xl md:text-2xl tracking-wider text-background">
                NUKOO
              </span>
            </motion.a>
            
            <motion.p
              className="text-background/60 font-sans text-sm mb-6 md:mb-8 max-w-xs leading-relaxed"
              initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Building dreams and providing exclusive real estate and construction services 
              in the world&apos;s most prestigious locations.
            </motion.p>
            
            <div className="flex flex-col gap-2 mb-6">
              <div className="flex items-center gap-2 text-background/60 text-sm">
                <MapPin className="w-4 h-4 text-primary" />
                <span>Ghana, Oyarifa High Tension</span>
              </div>
              <div className="flex items-center gap-2 text-background/60 text-sm">
                <Phone className="w-4 h-4 text-primary" />
                <span>0599723940, 0244937048</span>
              </div>
            </div>
            
            {/* Social links with 3D hover effects */}
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <SocialButton key={social.label} social={social} index={index} />
              ))}
            </div>
          </div>
          
          {/* Links with stagger animation */}
          {Object.entries(footerLinks).map(([category, links], categoryIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + categoryIndex * 0.1 }}
            >
              <h4 className="font-serif text-base md:text-lg mb-4 md:mb-6 capitalize relative inline-block">
                {category}
                <motion.span
                  className="absolute -bottom-1 left-0 w-8 h-[2px] bg-primary"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + categoryIndex * 0.1, duration: 0.5 }}
                />
              </h4>
              <ul className="space-y-2 md:space-y-3">
                {links.map((link, index) => (
                  <motion.li
                    key={link}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + categoryIndex * 0.1 + index * 0.05 }}
                  >
                    <motion.a
                      href="#"
                      className="text-background/60 hover:text-background font-sans text-sm transition-colors duration-300 inline-block relative"
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {link}
                      <motion.span
                        className="absolute -left-3 top-1/2 w-1 h-1 bg-primary rounded-full -translate-y-1/2 opacity-0"
                        whileHover={{ opacity: 1 }}
                      />
                    </motion.a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
        
        {/* Animated divider */}
        <motion.div
          className="h-px mb-6 md:mb-8 relative overflow-hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="absolute inset-0 bg-background/10" />
          <motion.div
            className="absolute inset-0 bg-primary/30"
            initial={{ x: "-100%" }}
            whileInView={{ x: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: 0.3 }}
          />
        </motion.div>
        
        {/* Bottom section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <motion.p
            className="text-background/40 font-sans text-xs md:text-sm order-2 md:order-1"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            &copy; {new Date().getFullYear()} Nukoo Construction & Properties. All rights reserved.
          </motion.p>
          
          <div className="flex items-center gap-4 md:gap-6 order-1 md:order-2">
            {["Privacy Policy", "Terms of Service"].map((item, index) => (
              <motion.a
                key={item}
                href="#"
                className="text-background/40 hover:text-background font-sans text-xs md:text-sm transition-colors duration-300"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + index * 0.1 }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                {item}
              </motion.a>
            ))}
          </div>
          
          {/* Back to top button */}
          <MagneticButton
            onClick={scrollToTop}
            className="w-12 h-12 border border-background/20 flex items-center justify-center relative overflow-hidden group order-3"
          >
            <ArrowUp className="w-5 h-5 relative z-10 group-hover:text-foreground transition-colors duration-300" />
            <motion.div
              className="absolute inset-0 bg-background"
              initial={{ y: "100%" }}
              whileHover={{ y: "0%" }}
              transition={{ duration: 0.3 }}
            />
          </MagneticButton>
        </div>
      </div>
      
      {/* Decorative corner elements */}
      <motion.div
        className="absolute bottom-0 right-0 w-32 md:w-40 h-32 md:h-40 border-t border-l border-background/5 pointer-events-none"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
      />
    </footer>
  )
}
