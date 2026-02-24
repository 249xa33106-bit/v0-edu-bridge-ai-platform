import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="rounded-2xl border border-primary/20 bg-primary/5 px-8 py-16 text-center lg:px-16">
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground lg:text-4xl text-balance">
            Ready to Bridge the Gap?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground text-pretty">
            Whether you are a student seeking better learning outcomes or a teacher looking for data-driven insights, EduBridge AI is built for you.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild className="gap-2">
              <Link href="/learn">
                Explore as Student
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/teacher">Explore as Teacher</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
