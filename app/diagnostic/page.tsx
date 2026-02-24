import { Navbar } from "@/components/navbar"
import { DiagnosticClient } from "@/components/diagnostic/diagnostic-client"
import { AuthGuard } from "@/components/auth/auth-guard"

export default function DiagnosticPage() {
  return (
    <AuthGuard allowedRoles={["student"]}>
      <div className="relative z-10 min-h-screen">
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
              AI Learning Gap Detection
            </h1>
            <p className="mt-2 text-muted-foreground">
              Take a diagnostic assessment to identify weak concepts, view your topic strength heatmap, and receive personalized improvement plans.
            </p>
          </div>
          <DiagnosticClient />
        </main>
      </div>
    </AuthGuard>
  )
}
