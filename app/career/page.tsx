import { Navbar } from "@/components/navbar"
import { CareerClient } from "@/components/career/career-client"
import { AuthGuard } from "@/components/auth/auth-guard"

export default function CareerPage() {
  return (
    <AuthGuard allowedRoles={["student"]}>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
              AI Skill-Mapping & Career Intelligence
            </h1>
            <p className="mt-2 text-muted-foreground">
              Map your skills against industry requirements, identify gaps, and receive actionable course, project, and certification suggestions.
            </p>
          </div>
          <CareerClient />
        </main>
      </div>
    </AuthGuard>
  )
}
