"use client"

import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import { PropertyCard } from "./property-card"
import { LineReveal } from "./text-reveal"
import { ArrowRight } from "lucide-react"
import { MagneticButton } from "./magnetic-button"
import { getProperties } from "@/lib/api"

export function PropertiesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [isMobile, setIsMobile] = useState(false)
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    async function fetchProperties() {
      try {
        const response = await getProperties()
        const raw = response?.data
        setProperties(Array.isArray(raw) ? raw : [])
      } catch (err) {
        console.error('Error fetching properties:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProperties()
  }, [])
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })
  
  const x = useTransform(scrollYProgress, [0, 1], [0, -200])
  const lineWidth = useTransform(scrollYProgress, [0, 0.5], ["0%", "100%"])
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360])

  return (
    <section id="properties" ref={ref} className="py-20 md:py-32 px-4 md:px-6 lg:px-12 bg-background relative overflow-hidden">
      {/* ... (rest of the component remains the same) */}
      <div className="max-w-7xl mx-auto relative z-10">
        {isMobile ? (
          <div
            className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide no-scrollbar -mx-4 px-4 md:mx-0 md:px-0"
            style={{
              WebkitOverflowScrolling: 'touch',
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
            }}
          >
            {properties.map((property, index) => (
              <div
                key={property.id}
                className="min-w-[min(85vw,calc(100vw-2rem))] max-w-[min(85vw,calc(100vw-2rem))] shrink-0 snap-center"
              >
                <PropertyCard property={property} index={index} />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-8 lg:gap-12">
            {properties.map((property, index) => (
              <PropertyCard key={property.id} property={property} index={index} />
            ))}
          </div>
        )}
      </div>
      {/* ... (rest of the component remains the same) */}
    </section>
  )
}
