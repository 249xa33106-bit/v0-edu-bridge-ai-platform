"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import {
  BookOpen,
  Brain,
  BarChart3,
  Route,
  FlaskConical,
  Menu,
  X,
  GraduationCap,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const navItems = [
  { href: "/learn", label: "AI Tutor", icon: BookOpen },
  { href: "/diagnostic", label: "Gap Detection", icon: Brain },
  { href: "/study-plan", label: "Study Plan", icon: Route },
  { href: "/career", label: "Career Intel", icon: BarChart3 },
  { href: "/teacher", label: "Teacher Dashboard", icon: BarChart3 },
  { href: "/lab", label: "Virtual Lab", icon: FlaskConical },
]

export function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary">
            <GraduationCap className="size-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-foreground">
            EduBridge <span className="text-primary">AI</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" role="navigation" aria-label="Main navigation">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Button variant="outline" size="sm" asChild>
            <Link href="/teacher">Teacher Login</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/learn">Start Learning</Link>
          </Button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </Button>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-card px-4 pb-4 pt-2 lg:hidden">
          <nav className="flex flex-col gap-1" role="navigation" aria-label="Mobile navigation">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="size-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
          <div className="mt-3 flex flex-col gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/teacher">Teacher Login</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/learn">Start Learning</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
