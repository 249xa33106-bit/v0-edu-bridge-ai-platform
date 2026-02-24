import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Globe, Brain, Sparkles } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-32">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/3 size-[600px] rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute right-0 top-1/2 size-[400px] rounded-full bg-accent/6 blur-3xl" />
      </div>
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <Sparkles className="size-4" />
            AI-Powered Education for Everyone
          </div>
          <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance">
            Learn in Your Language.{" "}
            <span className="text-primary">Grow at Your Pace.</span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground text-pretty lg:text-xl">
            EduBridge AI uses adaptive learning, multilingual translation, and career intelligence to help rural and Tier-2/Tier-3 students overcome educational barriers and build real-world skills.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild className="gap-2">
              <Link href="/register">
                Start Learning Now
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { icon: Globe, label: "Multilingual", desc: "Learn in Telugu, Hindi, and more" },
            { icon: Brain, label: "Adaptive AI", desc: "Personalized to your skill level" },
            { icon: Sparkles, label: "Career Ready", desc: "Skill-mapped to industry needs" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-6 text-center"
            >
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                <item.icon className="size-5 text-primary" />
              </div>
              <h3 className="font-display text-sm font-semibold text-foreground">{item.label}</h3>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
