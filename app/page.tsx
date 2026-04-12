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
import { getSiteUrl } from "@/lib/site-url"

function HomeJsonLd() {
  const url = getSiteUrl()
  const description =
    "Nukoo Construction & Properties — construction and real estate in prime locations."
  const structured = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${url}/#organization`,
        name: "Nukoo Construction & Properties",
        url,
        logo: `${url}/icon.svg`,
        description,
      },
      {
        "@type": "WebSite",
        "@id": `${url}/#website`,
        name: "Nukoo Construction & Properties",
        url,
        description,
        publisher: { "@id": `${url}/#organization` },
      },
    ],
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structured) }}
    />
  )
}

export default function Home() {
  return (
    <main className="relative bg-background">
      <HomeJsonLd />
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
