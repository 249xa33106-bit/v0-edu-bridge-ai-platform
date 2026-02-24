import { Navbar } from "@/components/navbar"
import { StudyPlanClient } from "@/components/study-plan/study-plan-client"

export default function StudyPlanPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
            Personalized Study Plan Generator
          </h1>
          <p className="mt-2 text-muted-foreground">
            Set your target role, current skill level, and time availability to receive a dynamic roadmap with practice schedules and progress tracking.
          </p>
        </div>
        <StudyPlanClient />
      </main>
    </div>
  )
}
