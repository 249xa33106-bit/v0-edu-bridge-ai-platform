import {
  BookOpen,
  Brain,
  Route,
  BarChart3,
  GraduationCap,
  FlaskConical,
} from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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
    <section className="border-t border-border bg-card py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground lg:text-4xl text-balance">
            Six Pillars of Personalized Learning
          </h2>
          <p className="mt-4 text-muted-foreground text-pretty">
            Every feature is designed to solve a real educational problem for students and teachers in underserved communities.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="group border-border bg-background transition-shadow hover:shadow-lg"
            >
              <CardHeader>
                <div className="mb-3 flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <feature.icon className="size-5" />
                </div>
                <CardTitle className="font-display text-lg">{feature.title}</CardTitle>
                <CardDescription className="leading-relaxed">
                  {feature.description}
                </CardDescription>
                <div className="flex flex-wrap gap-1.5 pt-3">
                  {feature.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
