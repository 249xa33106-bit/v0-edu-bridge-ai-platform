"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
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
  LogOut,
  User,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth/auth-provider"

const studentNavItems = [
  { href: "/learn", label: "AI Tutor", icon: BookOpen },
  { href: "/diagnostic", label: "Gap Detection", icon: Brain },
  { href: "/study-plan", label: "Study Plan", icon: Route },
  { href: "/career", label: "Career Intel", icon: BarChart3 },
  { href: "/lab", label: "Virtual Lab", icon: FlaskConical },
]

const teacherNavItems = [
  { href: "/teacher", label: "Dashboard", icon: BarChart3 },
]

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, logout } = useAuth()

  const navItems = user?.role === "teacher" ? teacherNavItems : studentNavItems

  function handleLogout() {
    logout()
    setMobileOpen(false)
    router.push("/")
  }

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

        {user && (
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
        )}

        <div className="hidden items-center gap-3 lg:flex">
          {user ? (
            <>
              <div className="flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1.5">
                <div className="flex size-6 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <User className="size-3.5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-medium leading-none text-foreground">{user.name}</span>
                  <span className="text-[10px] leading-none text-muted-foreground capitalize">{user.role}</span>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout} className="gap-1.5">
                <LogOut className="size-3.5" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register">Get Started</Link>
              </Button>
            </>
          )}
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
          {user && (
            <div className="mb-3 flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2.5">
              <div className="flex size-8 items-center justify-center rounded-full bg-primary/15 text-primary">
                <User className="size-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-foreground">{user.name}</span>
                <span className="text-xs text-muted-foreground capitalize">{user.role}</span>
              </div>
            </div>
          )}

          {user && (
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
          )}

          <div className="mt-3 flex flex-col gap-2">
            {user ? (
              <Button variant="outline" size="sm" onClick={handleLogout} className="gap-1.5">
                <LogOut className="size-3.5" />
                Logout
              </Button>
            ) : (
              <>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/login" onClick={() => setMobileOpen(false)}>Sign In</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/register" onClick={() => setMobileOpen(false)}>Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
