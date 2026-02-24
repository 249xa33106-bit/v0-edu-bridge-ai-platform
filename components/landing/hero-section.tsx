"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Globe, Brain, Sparkles } from "lucide-react"
import { StaggerContainer, FadeInUp } from "@/components/motion"

const pillars = [
  { icon: Globe, label: "Multilingual", desc: "Learn in Telugu, Hindi, and more" },
  { icon: Brain, label: "Adaptive AI", desc: "Personalized to your skill level" },
  { icon: Sparkles, label: "Career Ready", desc: "Skill-mapped to industry needs" },
]

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-36">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <StaggerContainer className="mx-auto max-w-3xl text-center">
          <FadeInUp>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary glass">
              <Sparkles className="size-4" />
              AI-Powered Education for Everyone
            </div>
          </FadeInUp>
          <FadeInUp>
            <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance">
              Learn in Your Language.{" "}
              <span className="bg-gradient-to-r from-primary to-chart-3 bg-clip-text text-transparent">
                Grow at Your Pace.
              </span>
            </h1>
          </FadeInUp>
          <FadeInUp>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground text-pretty lg:text-xl">
              EduBridge AI uses adaptive learning, multilingual translation, and career intelligence to help rural and Tier-2/Tier-3 students overcome educational barriers and build real-world skills.
            </p>
          </FadeInUp>
          <FadeInUp>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild className="gap-2 btn-glow">
                <Link href="/register">
                  Start Learning Now
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="btn-glow">
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </FadeInUp>
        </StaggerContainer>

        <StaggerContainer className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3">
          {pillars.map((item) => (
            <FadeInUp key={item.label}>
              <motion.div
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="flex flex-col items-center gap-3 rounded-2xl p-6 text-center glass-card card-hover"
              >
                <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
                  <item.icon className="size-5 text-primary" />
                </div>
                <h3 className="font-display text-sm font-semibold text-foreground">{item.label}</h3>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </motion.div>
            </FadeInUp>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}
