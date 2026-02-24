import { Navbar } from "@/components/navbar"
import { TeacherClient } from "@/components/teacher/teacher-client"

export default function TeacherPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
            Teacher Performance Analytics
          </h1>
          <p className="mt-2 text-muted-foreground">
            Class-level insights with topic heatmaps, at-risk student prediction, engagement tracking, and automated reports.
          </p>
        </div>
        <TeacherClient />
      </main>
    </div>
  )
}
