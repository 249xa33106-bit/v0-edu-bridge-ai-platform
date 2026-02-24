import { Navbar } from "@/components/navbar"
import { LearnClient } from "@/components/learn/learn-client"
import { AuthGuard } from "@/components/auth/auth-guard"

export default function LearnPage() {
  return (
    <AuthGuard allowedRoles={["student"]}>
      <div className="relative z-10 min-h-screen">
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
              Multilingual AI Learning Assistant
            </h1>
            <p className="mt-2 text-muted-foreground">
              Upload your notes, select a language, and get simplified explanations with audio support and interactive Q&A.
            </p>
          </div>
          <LearnClient />
        </main>
      </div>
    </AuthGuard>
  )
}
