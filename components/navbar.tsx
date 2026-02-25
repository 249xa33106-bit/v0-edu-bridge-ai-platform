"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  BookOpen,
  Brain,
  BarChart3,
  Route,
  FlaskConical,
  Menu,
  X,
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
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="sticky top-0 z-50 glass-nav"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        <Link href="/" className="flex items-center gap-2 group">
          <Image
            src="/images/logo.jpg"
            alt="EduBridge AI logo"
            width={32}
            height={32}
            className="size-8 rounded-lg object-cover transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-purple-500/25"
          />
          <span className="font-display text-xl font-bold tracking-tight text-foreground">
            EduBridge <span className="bg-gradient-to-r from-primary to-chart-3 bg-clip-text text-transparent">AI</span>
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
                    "group/link relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-purple-500/15 text-purple-300"
                      : "text-muted-foreground hover:bg-purple-500/10 hover:text-purple-200"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-lg bg-purple-500/15"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className="relative flex items-center gap-1.5">
                    <item.icon className="size-4 transition-all duration-300 group-hover/link:scale-125 group-hover/link:text-purple-400" />
                    {item.label}
                  </span>
                </Link>
              )
            })}
          </nav>
        )}

        <div className="hidden items-center gap-3 lg:flex">
          {user ? (
            <>
              <div className="group/user flex items-center gap-2 rounded-full px-3 py-1.5 glass-card transition-all duration-300 hover:bg-purple-500/10">
                <div className="flex size-7 items-center justify-center rounded-full bg-purple-500/15 text-purple-400 transition-all duration-300 group-hover/user:scale-110 group-hover/user:bg-purple-500/25">
                  <User className="size-3.5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-medium leading-none text-foreground">{user.name}</span>
                  <span className="text-[10px] leading-none text-muted-foreground capitalize">{user.role}</span>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout} className="group/logout gap-1.5 btn-glow hover:border-purple-500/30 hover:text-purple-300">
                <LogOut className="size-3.5 transition-all duration-300 group-hover/logout:scale-110 group-hover/logout:text-purple-400" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" asChild className="btn-glow">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button size="sm" asChild className="btn-glow">
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

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-t border-white/10 px-4 lg:hidden glass-card"
          >
            <div className="pb-4 pt-2">
              {user && (
                <div className="mb-3 flex items-center gap-2 rounded-xl px-3 py-2.5 glass-card">
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
                          "group/mlink flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                          isActive
                            ? "bg-purple-500/15 text-purple-300"
                            : "text-muted-foreground hover:bg-purple-500/10 hover:text-purple-200"
                        )}
                      >
                        <item.icon className="size-4 transition-all duration-300 group-hover/mlink:scale-125 group-hover/mlink:text-purple-400" />
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
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
