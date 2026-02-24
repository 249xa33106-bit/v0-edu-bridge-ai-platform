"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { StaggerContainer, FadeInUp } from "@/components/motion"

export function CTASection() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <StaggerContainer>
          <FadeInUp>
            <motion.div
              whileHover={{ scale: 1.005 }}
              transition={{ duration: 0.3 }}
              className="rounded-3xl px-8 py-16 text-center lg:px-16 glass-card"
              style={{
                background: "linear-gradient(135deg, rgba(99, 220, 190, 0.06), rgba(59, 130, 246, 0.04))",
                border: "1px solid rgba(99, 220, 190, 0.15)",
              }}
            >
              <h2 className="font-display text-3xl font-bold tracking-tight text-foreground lg:text-4xl text-balance">
                Ready to Bridge the Gap?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-muted-foreground text-pretty">
                Whether you are a student seeking better learning outcomes or a teacher looking for data-driven insights, EduBridge AI is built for you.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" asChild className="gap-2 btn-glow">
                  <Link href="/register">
                    Get Started Free
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="btn-glow">
                  <Link href="/login">Sign In</Link>
                </Button>
              </div>
            </motion.div>
          </FadeInUp>
        </StaggerContainer>
      </div>
    </section>
  )
}
