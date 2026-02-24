import { Navbar } from "@/components/navbar"
import { LabClient } from "@/components/lab/lab-client"
import { AuthGuard } from "@/components/auth/auth-guard"

export default function LabPage() {
  return (
    <AuthGuard allowedRoles={["student"]}>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
              Virtual Lab Simulation
            </h1>
            <p className="mt-2 text-muted-foreground">
              AI-guided coding sandbox with step-by-step experiment walkthroughs and automated evaluation.
            </p>
          </div>
          <LabClient />
        </main>
      </div>
    </AuthGuard>
  )
}
