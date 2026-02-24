import { HeroSection } from "@/components/landing/hero-section"
import { FeaturesGrid } from "@/components/landing/features-grid"
import { MetricsSection } from "@/components/landing/metrics-section"
import { DemoFlowSection } from "@/components/landing/demo-flow-section"
import { CTASection } from "@/components/landing/cta-section"
import { Navbar } from "@/components/navbar"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesGrid />
        <MetricsSection />
        <DemoFlowSection />
        <CTASection />
      </main>
      <footer className="border-t border-border bg-card py-8">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-muted-foreground lg:px-8">
          <p>EduBridge AI - Bridging the gap in education through intelligent, personalized learning.</p>
        </div>
      </footer>
    </div>
  )
}
