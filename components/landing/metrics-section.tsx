"use client"

import { motion } from "framer-motion"
import { TrendingUp, Users, Clock, Target } from "lucide-react"
import { StaggerContainer, FadeInUp } from "@/components/motion"

const metrics = [
  {
    icon: TrendingUp,
    value: "42%",
    label: "Quiz Score Improvement",
    description: "Average increase after adaptive learning cycles",
  },
  {
    icon: Users,
    value: "3.5x",
    label: "Engagement Boost",
    description: "Higher engagement via regional language content",
  },
  {
    icon: Clock,
    value: "60%",
    label: "Teacher Time Saved",
    description: "Reduction in manual evaluation effort",
  },
  {
    icon: Target,
    value: "78%",
    label: "Career Readiness",
    description: "Students achieving career-ready scores",
  },
]

export function MetricsSection() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <StaggerContainer className="mx-auto mb-14 max-w-2xl text-center">
          <FadeInUp>
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground lg:text-4xl text-balance">
              Measurable Impact
            </h2>
          </FadeInUp>
          <FadeInUp>
            <p className="mt-4 text-muted-foreground text-pretty">
              Real metrics demonstrating how EduBridge AI transforms learning outcomes for underserved students.
            </p>
          </FadeInUp>
        </StaggerContainer>
        <StaggerContainer className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <FadeInUp key={metric.label}>
              <motion.div
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="flex flex-col items-center rounded-2xl p-8 text-center glass-card card-hover"
              >
                <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary/10">
                  <metric.icon className="size-6 text-primary" />
                </div>
                <span className="font-display text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  {metric.value}
                </span>
                <span className="mt-2 text-sm font-semibold text-foreground">{metric.label}</span>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{metric.description}</p>
              </motion.div>
            </FadeInUp>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}
