"use client"

import { motion } from "framer-motion"
import { Upload, Languages, ClipboardList, Brain, Route, BarChart3, GraduationCap } from "lucide-react"
import { StaggerContainer, FadeInUp } from "@/components/motion"

const steps = [
  { icon: Upload, label: "Upload Notes", desc: "Student uploads English-medium study material" },
  { icon: Languages, label: "AI Translates", desc: "Content simplified and translated to regional language" },
  { icon: ClipboardList, label: "Diagnostic Quiz", desc: "Adaptive diagnostic test identifies weak areas" },
  { icon: Brain, label: "Gap Analysis", desc: "ML engine detects weak concept clusters" },
  { icon: Route, label: "Study Plan", desc: "Personalized 4-12 week roadmap generated" },
  { icon: BarChart3, label: "Career Map", desc: "Skills mapped to industry with readiness score" },
  { icon: GraduationCap, label: "Teacher View", desc: "Analytics dashboard shows class-level insights" },
]

export function DemoFlowSection() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <StaggerContainer className="mx-auto mb-14 max-w-2xl text-center">
          <FadeInUp>
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground lg:text-4xl text-balance">
              How It Works
            </h2>
          </FadeInUp>
          <FadeInUp>
            <p className="mt-4 text-muted-foreground text-pretty">
              A complete end-to-end learning journey from content upload to career readiness.
            </p>
          </FadeInUp>
        </StaggerContainer>
        <div className="relative">
          <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-primary/20 to-transparent lg:block" aria-hidden="true" />
          <StaggerContainer className="flex flex-col gap-8 lg:gap-0">
            {steps.map((step, i) => (
              <FadeInUp key={step.label}>
                <div
                  className={`flex items-center gap-6 lg:gap-12 ${
                    i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                  } ${i > 0 ? "lg:mt-8" : ""}`}
                >
                  <div className={`flex-1 ${i % 2 === 0 ? "lg:text-right" : "lg:text-left"}`}>
                    <motion.div
                      whileHover={{ x: i % 2 === 0 ? -4 : 4 }}
                      transition={{ duration: 0.2 }}
                    >
                      <h3 className="font-display text-base font-semibold text-foreground">{step.label}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{step.desc}</p>
                    </motion.div>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.15 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="relative z-10 flex size-14 shrink-0 items-center justify-center rounded-2xl border-2 border-primary/30 text-primary glass-card"
                  >
                    <step.icon className="size-5" />
                    <span className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-md">
                      {i + 1}
                    </span>
                  </motion.div>
                  <div className="hidden flex-1 lg:block" />
                </div>
              </FadeInUp>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  )
}
