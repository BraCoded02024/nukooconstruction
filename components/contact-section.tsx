"use client"

import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion"
import { useRef, useState } from "react"
import { LineReveal } from "./text-reveal"
import { MagneticButton } from "./magnetic-button"
import { ArrowRight, MapPin, Phone, Mail, Loader2, CheckCircle } from "lucide-react"
import { createLead } from "@/lib/api"

export function ContactSection() {
  const ref = useRef(null)
  const formRef = useRef<HTMLDivElement>(null)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [hoveredInfo, setHoveredInfo] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await createLead({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        notes: formData.message,
        interest: 'General Inquiry'
      })
      setSubmitted(true)
      setFormData({ name: '', email: '', phone: '', message: '' })
    } catch (err: any) {
      console.error('Error submitting form:', err)
      setError(err.response?.data?.error || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  
  // Form 3D tilt
  const formX = useMotionValue(0.5)
  const formY = useMotionValue(0.5)
  const springConfig = { damping: 25, stiffness: 300 }
  const formXSpring = useSpring(formX, springConfig)
  const formYSpring = useSpring(formY, springConfig)
  const formRotateX = useTransform(formYSpring, [0, 1], [8, -8])
  const formRotateY = useTransform(formXSpring, [0, 1], [-8, 8])
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })
  
  const y = useTransform(scrollYProgress, [0, 1], [100, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1.1, 1])

  const handleFormMove = (clientX: number, clientY: number) => {
    if (!formRef.current) return
    const rect = formRef.current.getBoundingClientRect()
    formX.set((clientX - rect.left) / rect.width)
    formY.set((clientY - rect.top) / rect.height)
  }

  const contactInfo = [
    { icon: MapPin, label: "Visit Us", value: "Ghana, Oyarifa High Tension, Greater Accra Region" },
    { icon: Phone, label: "Call Us", value: "0599723940 , 0244937048" },
    { icon: Mail, label: "Email Us", value: "Nukooconstruction@gmail.com" },
  ]

  const formFields = [
    { name: "name", label: "Full Name", type: "text" },
    { name: "email", label: "Email Address", type: "email" },
    { name: "phone", label: "Phone Number", type: "tel" },
    { name: "message", label: "Your Message", type: "textarea" },
  ]

  return (
    <section id="contact" ref={ref} className="relative py-24 md:py-32 overflow-hidden">
      {/* Parallax background with scale */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y, scale }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1920&q=80')` }}
        />
        <div className="absolute inset-0 bg-foreground/80" />
      </motion.div>
      
      {/* Animated grid overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-10">
        <svg className="w-full h-full">
          <pattern id="contactGrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#contactGrid)" />
        </svg>
      </div>
      
      {/* Floating particles for mobile */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-background/40 rounded-full pointer-events-none"
          style={{
            left: `${10 + i * 12}%`,
            top: `${15 + (i % 4) * 20}%`,
          }}
          animate={{
            y: [-20, 20, -20],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 4 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        />
      ))}
      
      {/* Floating decorative elements */}
      <motion.div
        className="absolute top-20 left-10 w-24 h-24 border border-background/10 pointer-events-none hidden md:block"
        animate={{ rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute bottom-32 right-20 w-4 h-4 bg-primary rounded-full pointer-events-none"
        animate={{ 
          scale: [1, 1.5, 1], 
          opacity: [0.5, 1, 0.5] 
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      
      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12"
        style={{ opacity }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          {/* Left side - Info */}
          <div className="text-background">
            <motion.span
              className="text-primary text-sm tracking-[0.3em] uppercase font-sans mb-6 block"
              initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true }}
            >
              Get In Touch
            </motion.span>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-8">
              <LineReveal>{"Let's Start"}</LineReveal>
              <LineReveal delay={0.1}>Your Journey</LineReveal>
            </h2>
            
            <motion.p
              className="text-background/70 font-sans mb-10 md:mb-12 max-w-md leading-relaxed"
              initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Whether you&apos;re seeking your dream home or considering selling your 
              exceptional property, our team is ready to provide personalized guidance.
            </motion.p>
            
            {/* Contact info cards with 3D effect */}
            <div className="space-y-4 md:space-y-6">
              {contactInfo.map((item, index) => {
                const Icon = item.icon
                return (
                  <motion.div
                    key={item.label}
                    className="flex items-start gap-4 group cursor-default p-4 -mx-4 rounded-sm"
                    initial={{ opacity: 0, x: -30, filter: "blur(10px)" }}
                    whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                    onMouseEnter={() => setHoveredInfo(index)}
                    onMouseLeave={() => setHoveredInfo(null)}
                    whileHover={{ x: 10, backgroundColor: "rgba(255,255,255,0.05)" }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.div 
                      className="w-14 h-14 bg-primary/20 flex items-center justify-center relative overflow-hidden flex-shrink-0"
                      animate={{ 
                        backgroundColor: hoveredInfo === index ? "rgba(var(--primary), 0.3)" : "rgba(var(--primary), 0.2)"
                      }}
                    >
                      <Icon className="w-5 h-5 text-primary relative z-10" />
                      <motion.div
                        className="absolute inset-0 bg-primary"
                        initial={{ y: "100%" }}
                        animate={{ y: hoveredInfo === index ? "0%" : "100%" }}
                        transition={{ duration: 0.3 }}
                      />
                      
                      {/* Corner accents */}
                      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary/50" />
                      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary/50" />
                    </motion.div>
                    <div>
                      <span className="text-background/50 text-xs font-sans tracking-wider uppercase block mb-1">
                        {item.label}
                      </span>
                      <span className="text-background font-sans text-sm md:text-base">
                        {item.value}
                      </span>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
          
          {/* Right side - Form with 3D effect */}
          <motion.div
            ref={formRef}
            className="bg-card p-6 md:p-8 lg:p-12 relative"
            initial={{ opacity: 0, y: 60, rotateY: -10 }}
            whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{ 
              transformPerspective: 1200,
              rotateX: formRotateX,
              rotateY: formRotateY,
              transformStyle: "preserve-3d",
            }}
            onMouseMove={(e) => handleFormMove(e.clientX, e.clientY)}
            onMouseLeave={() => { formX.set(0.5); formY.set(0.5) }}
            onTouchMove={(e) => handleFormMove(e.touches[0].clientX, e.touches[0].clientY)}
            onTouchEnd={() => { formX.set(0.5); formY.set(0.5) }}
          >
            {/* Animated corner decorations */}
            <motion.div 
              className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary/30"
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <motion.div 
              className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary/30"
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
            />
            
            {/* Scan line effect */}
            <motion.div
              className="absolute inset-0 pointer-events-none overflow-hidden"
            >
              <motion.div
                className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"
                animate={{ top: ["-5%", "105%"] }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
            
            {/* Glare effect */}
            <motion.div
              className="absolute inset-0 pointer-events-none opacity-30"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)",
                transform: "translateZ(20px)",
              }}
            />
            
            <motion.h3 
              className="text-xl md:text-2xl font-serif text-foreground mb-6 md:mb-8"
              style={{ transform: "translateZ(30px)" }}
            >
              Schedule a Consultation
            </motion.h3>
            
            {submitted ? (
              <motion.div 
                className="flex flex-col items-center justify-center py-12 text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <CheckCircle className="w-16 h-16 text-primary mb-6" />
                <h4 className="text-2xl font-serif mb-4">Message Sent!</h4>
                <p className="text-muted-foreground font-sans">
                  Thank you for reaching out. We will get back to you shortly.
                </p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="mt-8 text-primary uppercase tracking-widest text-xs font-sans hover:underline"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8" style={{ transform: "translateZ(20px)" }}>
                {error && (
                  <p className="text-red-500 text-sm font-sans">{error}</p>
                )}
                {formFields.map((field, index) => (
                  <motion.div
                    key={field.name}
                    className="relative"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                  >
                    <motion.label
                      className={`absolute left-0 transition-all duration-300 font-sans text-sm tracking-wider uppercase pointer-events-none ${
                        focusedField === field.name || formData[field.name as keyof typeof formData]
                          ? "-top-6 text-xs text-primary"
                          : "top-3 text-muted-foreground"
                      }`}
                      animate={{
                        scale: focusedField === field.name || formData[field.name as keyof typeof formData] ? 0.85 : 1,
                      }}
                    >
                      {field.label}
                    </motion.label>
                    
                    {field.type === "textarea" ? (
                      <textarea
                        required
                        className="w-full bg-transparent border-b border-border focus:border-primary outline-none py-3 text-foreground font-sans resize-none h-24 transition-colors duration-300"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        onFocus={() => setFocusedField(field.name)}
                        onBlur={(e) => !e.target.value && setFocusedField(null)}
                      />
                    ) : (
                      <input
                        required
                        type={field.type}
                        className="w-full bg-transparent border-b border-border focus:border-primary outline-none py-3 text-foreground font-sans transition-colors duration-300"
                        value={formData[field.name as keyof typeof formData]}
                        onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                        onFocus={() => setFocusedField(field.name)}
                        onBlur={(e) => !e.target.value && setFocusedField(null)}
                      />
                    )}
                    
                    {/* Animated underline */}
                    <motion.div
                      className="absolute bottom-0 left-0 h-[2px] bg-primary"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: focusedField === field.name ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ originX: 0 }}
                    />
                  </motion.div>
                ))}
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 }}
                  className="pt-4"
                >
                  <MagneticButton 
                    disabled={loading}
                    type="submit"
                    className="w-full py-4 bg-foreground text-background font-sans text-sm tracking-widest uppercase flex items-center justify-center gap-3 group overflow-hidden relative disabled:opacity-50"
                  >
                    <span className="relative z-10">
                      {loading ? 'Sending...' : 'Send Message'}
                    </span>
                    {!loading && (
                      <motion.span
                        className="inline-block relative z-10"
                        whileHover={{ x: 5, rotate: 45 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <ArrowRight className="w-4 h-4" />
                      </motion.span>
                    )}
                    
                    {/* Button hover effect */}
                    <motion.div
                      className="absolute inset-0 bg-primary"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </MagneticButton>
                </motion.div>
              </form>
            )}
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
