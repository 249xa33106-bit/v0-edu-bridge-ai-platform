import { Navbar } from "@/components/navbar"
import { MaterialsClient } from "@/components/materials/materials-client"
import { AuthGuard } from "@/components/auth/auth-guard"

export default function MaterialsPage() {
  return (
    <AuthGuard allowedRoles={["student"]}>
      <div className="relative z-10 min-h-screen">
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
              Study Materials
            </h1>
            <p className="mt-2 text-muted-foreground">
              Upload, manage, and access your study documents. Supported formats: PDF, DOCX, DOC, and TXT.
            </p>
          </div>
          <MaterialsClient />
        </main>
      </div>
    </AuthGuard>
  )
}
