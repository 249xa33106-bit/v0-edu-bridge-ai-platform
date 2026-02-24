"use client"

import { motion } from "framer-motion"
import {
  BookOpen,
  Brain,
  Route,
  BarChart3,
  GraduationCap,
  FlaskConical,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { StaggerContainer, FadeInUp } from "@/components/motion"

const features = [
  {
    icon: BookOpen,
    title: "Multilingual AI Tutor",
    description:
      "Upload notes in English and get AI-powered translations, simplified explanations, text-to-speech, and Q&A in your regional language.",
    tags: ["Translation", "TTS", "STT", "Q&A"],
  },
  {
    icon: Brain,
    title: "Learning Gap Detection",
    description:
      "Diagnostic tests analyze topic accuracy, time spent, and mistake patterns using ML-based scoring to generate adaptive quizzes.",
    tags: ["ML Scoring", "Heatmap", "Adaptive"],
  },
  {
    icon: Route,
    title: "Personalized Study Plans",
    description:
      "Set your target role, skill level, and time availability to receive a dynamic 4-12 week roadmap that adjusts to your progress.",
    tags: ["Dynamic", "Roadmap", "Tracking"],
  },
  {
    icon: BarChart3,
    title: "Career Intelligence",
    description:
      "Map your skills against industry requirements with radar charts, identify gaps, and receive course, project, and certification suggestions.",
    tags: ["Skill Mapping", "Radar Chart", "Readiness"],
  },
  {
    icon: GraduationCap,
    title: "Teacher Analytics",
    description:
      "Class-level heatmaps, at-risk student prediction, engagement tracking, and automated reports for data-driven instruction.",
    tags: ["Heatmap", "Predictions", "Reports"],
  },
  {
    icon: FlaskConical,
    title: "Virtual Lab",
    description:
      "AI-guided coding sandbox with step-by-step lab walkthroughs, simulated experiments, and automated evaluation of submissions.",
    tags: ["Sandbox", "Auto-eval", "Interactive"],
  },
]

export function FeaturesGrid() {
  return (
    <section className="relative py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <StaggerContainer className="mx-auto mb-14 max-w-2xl text-center">
          <FadeInUp>
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground lg:text-4xl text-balance">
              Six Pillars of Personalized Learning
            </h2>
          </FadeInUp>
          <FadeInUp>
            <p className="mt-4 text-muted-foreground text-pretty">
              Every feature is designed to solve a real educational problem for students and teachers in underserved communities.
            </p>
          </FadeInUp>
        </StaggerContainer>
        <StaggerContainer className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <FadeInUp key={feature.title}>
              <motion.div
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="group rounded-2xl p-6 glass-card card-hover"
              >
                <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                  <feature.icon className="size-5" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-4">
                  {feature.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </motion.div>
            </FadeInUp>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}
