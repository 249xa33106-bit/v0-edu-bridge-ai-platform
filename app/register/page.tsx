"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { BookOpen, Users, Loader2, Eye, EyeOff } from "lucide-react"
import { useAuth, type UserRole } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageTransition } from "@/components/motion"

export default function RegisterPage() {
  const { register } = useAuth()
  const router = useRouter()
  const [role, setRole] = useState<UserRole>("student")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError("Please fill in all fields.")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setLoading(true)
    const result = await register(name.trim(), email.trim(), password, role)
    setLoading(false)

    if (!result.success) {
      setError(result.error || "Registration failed.")
      return
    }

    if (role === "teacher") {
      router.push("/teacher")
    } else {
      router.push("/learn")
    }
  }

  function renderForm(formRole: UserRole) {
    const prefix = formRole === "student" ? "s" : "t"
    return (
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor={`${prefix}-name`}>Full Name</Label>
          <Input
            id={`${prefix}-name`}
            type="text"
            placeholder={formRole === "student" ? "Ravi Kumar" : "Prof. Sharma"}
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            required
            className="bg-white/50 backdrop-blur-sm"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor={`${prefix}-email`}>Email Address</Label>
          <Input
            id={`${prefix}-email`}
            type="email"
            placeholder={formRole === "student" ? "you@college.edu" : "you@school.edu"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
            className="bg-white/50 backdrop-blur-sm"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor={`${prefix}-password`}>Password</Label>
          <div className="relative">
            <Input
              id={`${prefix}-password`}
              type={showPassword ? "text" : "password"}
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
              className="bg-white/50 backdrop-blur-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor={`${prefix}-confirm`}>Confirm Password</Label>
          <Input
            id={`${prefix}-confirm`}
            type={showPassword ? "text" : "password"}
            placeholder="Re-enter password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            required
            className="bg-white/50 backdrop-blur-sm"
          />
        </div>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-destructive"
          >
            {error}
          </motion.p>
        )}
        <Button type="submit" disabled={loading} className="w-full btn-glow">
          {loading ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
          Create {formRole === "student" ? "Student" : "Teacher"} Account
        </Button>
      </form>
    )
  }

  return (
    <div className="relative z-10 flex min-h-screen flex-col">
      <PageTransition className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        <Link href="/" className="mb-8 flex items-center gap-2.5 group">
          <Image
            src="/images/logo.jpg"
            alt="EduBridge AI logo"
            width={48}
            height={48}
            className="rounded-lg transition-transform duration-300 group-hover:scale-110"
            style={{ width: "auto", height: "auto" }}
          />
          <span className="font-display text-2xl font-bold tracking-tight text-foreground">
            EduBridge <span className="bg-gradient-to-r from-primary to-chart-3 bg-clip-text text-transparent">AI</span>
          </span>
        </Link>

        <motion.div
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <Card className="w-full max-w-md rounded-2xl glass-card">
            <CardHeader className="text-center">
              <CardTitle className="font-display text-2xl">Create Your Account</CardTitle>
              <CardDescription>Join EduBridge AI and start your journey</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={role} onValueChange={(v) => { setRole(v as UserRole); setError("") }}>
                <TabsList className="mb-6 w-full">
                  <TabsTrigger value="student" className="flex-1 gap-1.5">
                    <BookOpen className="size-4" />
                    Student
                  </TabsTrigger>
                  <TabsTrigger value="teacher" className="flex-1 gap-1.5">
                    <Users className="size-4" />
                    Teacher
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="student">{renderForm("student")}</TabsContent>
                <TabsContent value="teacher">{renderForm("teacher")}</TabsContent>
              </Tabs>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="font-medium text-primary hover:underline">
                  Sign in here
                </Link>
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <Link
          href="/"
          className="mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Back to Home
        </Link>
      </PageTransition>
    </div>
  )
}
