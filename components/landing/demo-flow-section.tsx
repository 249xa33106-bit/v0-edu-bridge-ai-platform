import { Upload, Languages, ClipboardList, Brain, Route, BarChart3, GraduationCap } from "lucide-react"

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
    <section className="border-t border-border bg-card py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground lg:text-4xl text-balance">
            How It Works
          </h2>
          <p className="mt-4 text-muted-foreground text-pretty">
            A complete end-to-end learning journey from content upload to career readiness.
          </p>
        </div>
        <div className="relative">
          <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-border lg:block" aria-hidden="true" />
          <div className="flex flex-col gap-8 lg:gap-0">
            {steps.map((step, i) => (
              <div
                key={step.label}
                className={`flex items-center gap-6 lg:gap-12 ${
                  i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                }`}
              >
                <div className={`flex-1 ${i % 2 === 0 ? "lg:text-right" : "lg:text-left"}`}>
                  <h3 className="font-display text-base font-semibold text-foreground">{step.label}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{step.desc}</p>
                </div>
                <div className="relative z-10 flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-card text-primary">
                  <step.icon className="size-5" />
                  <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {i + 1}
                  </span>
                </div>
                <div className="hidden flex-1 lg:block" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
