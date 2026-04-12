import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { PropertiesSection } from "@/components/properties-section"
import { AboutSection } from "@/components/about-section"
import { ServicesSection } from "@/components/services-section"
import { StatsSection } from "@/components/stats-section"
import { GallerySection } from "@/components/gallery-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"
import { CustomCursor } from "@/components/custom-cursor"
import { FloatingShapes } from "@/components/floating-shapes"
import { ScrollProgress } from "@/components/scroll-progress"

export default function Home() {
  return (
    <main className="relative bg-background">
      <CustomCursor />
      <ScrollProgress />
      <FloatingShapes />
      <Navigation />
      <HeroSection />
      <PropertiesSection />
      <StatsSection />
      <AboutSection />
      <GallerySection />
      <ServicesSection />
      <ContactSection />
      <Footer />
    </main>
  )
}
