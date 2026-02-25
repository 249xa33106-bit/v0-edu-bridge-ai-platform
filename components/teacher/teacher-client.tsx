"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Cell,
} from "recharts"
import {
  Users,
  AlertTriangle,
  TrendingUp,
  Download,
  BookOpen,
  Clock,
  BarChart3,
  Activity,
  Search,
  RefreshCw,
  UserCheck,
} from "lucide-react"

/* ------------------------------------------------------------------ */
/*  Types & helpers                                                     */
/* ------------------------------------------------------------------ */

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] } },
}
const glassCard =
  "rounded-2xl border border-white/[0.12] bg-white/[0.06] shadow-lg shadow-black/[0.04] backdrop-blur-xl"

interface TopicScore {
  topic: string
  correct: number
  total: number
}

interface QuizEntry {
  userId: string
  name: string
  email: string
  topicScores: TopicScore[]
  totalCorrect: number
  totalQuestions: number
  subject: string
  timestamp: number
}

interface StudentRecord {
  userId: string
  name: string
  email: string
  quizResults: QuizEntry[]
  lastActive: number
}

const ALL_RESULTS_KEY = "edubridge_all_quiz_results"
const USERS_KEY = "edubridge_users"

function getBarColor(score: number) {
  if (score >= 75) return "var(--color-chart-1)"
  if (score >= 60) return "var(--color-chart-2)"
  return "var(--color-destructive)"
}

function formatDate(ts: number) {
  try {
    return new Date(ts).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  } catch {
    return "N/A"
  }
}

function getLatestScore(s: StudentRecord) {
  if (s.quizResults.length === 0) return 0
  const last = s.quizResults[s.quizResults.length - 1]
  return Math.round((last.totalCorrect / last.totalQuestions) * 100)
}

function getAvgScore(s: StudentRecord) {
  if (s.quizResults.length === 0) return 0
  const total = s.quizResults.reduce(
    (sum, q) => sum + (q.totalCorrect / q.totalQuestions) * 100,
    0
  )
  return Math.round(total / s.quizResults.length)
}

function getStatus(score: number): { label: string; variant: "default" | "secondary" | "destructive" } {
  if (score >= 70) return { label: "On Track", variant: "default" }
  if (score >= 50) return { label: "Needs Work", variant: "secondary" }
  return { label: "At Risk", variant: "destructive" }
}

/* ------------------------------------------------------------------ */
/*  CSV Exports                                                        */
/* ------------------------------------------------------------------ */

function downloadCSV(csv: string, filename: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function exportStudentsCSV(students: StudentRecord[]) {
  const headers = ["Name", "Email", "Quizzes Taken", "Latest Score %", "Avg Score %", "Status", "Weak Topics", "Last Active"]
  const rows = students.map((s) => {
    const latest = getLatestScore(s)
    const avg = getAvgScore(s)
    const status = getStatus(avg)
    const topicTotals: Record<string, { correct: number; total: number }> = {}
    s.quizResults.forEach((qr) => {
      qr.topicScores.forEach((ts) => {
        if (!topicTotals[ts.topic]) topicTotals[ts.topic] = { correct: 0, total: 0 }
        topicTotals[ts.topic].correct += ts.correct
        topicTotals[ts.topic].total += ts.total
      })
    })
    const weakTopics = Object.entries(topicTotals)
      .filter(([, v]) => v.total > 0 && (v.correct / v.total) * 100 < 60)
      .map(([k]) => k)
      .join("; ")
    return [
      `"${s.name}"`, `"${s.email}"`, s.quizResults.length, latest, avg, status.label,
      `"${weakTopics}"`, `"${formatDate(s.lastActive)}"`,
    ].join(",")
  })
  downloadCSV([headers.join(","), ...rows].join("\n"), `student-overview-${new Date().toISOString().split("T")[0]}.csv`)
}

function exportAtRiskCSV(students: StudentRecord[]) {
  const atRisk = students.filter((s) => getAvgScore(s) < 50 && s.quizResults.length > 0)
  const headers = ["Name", "Email", "Avg Score %", "Risk Level", "Weak Topics", "Quizzes Taken"]
  const rows = atRisk.map((s) => {
    const avg = getAvgScore(s)
    const topicTotals: Record<string, { correct: number; total: number }> = {}
    s.quizResults.forEach((qr) => {
      qr.topicScores.forEach((ts) => {
        if (!topicTotals[ts.topic]) topicTotals[ts.topic] = { correct: 0, total: 0 }
        topicTotals[ts.topic].correct += ts.correct
        topicTotals[ts.topic].total += ts.total
      })
    })
    const weakTopics = Object.entries(topicTotals)
      .filter(([, v]) => v.total > 0 && (v.correct / v.total) * 100 < 60)
      .map(([k]) => k)
      .join("; ")
    return [
      `"${s.name}"`, `"${s.email}"`, avg, avg < 30 ? "High" : avg < 50 ? "Medium" : "Low",
      `"${weakTopics}"`, s.quizResults.length,
    ].join(",")
  })
  downloadCSV([headers.join(","), ...rows].join("\n"), `at-risk-students-${new Date().toISOString().split("T")[0]}.csv`)
}

function exportPerformanceCSV(topicData: { topic: string; avgScore: number; students: number }[]) {
  const headers = ["Topic", "Avg Score %", "Students Assessed"]
  const rows = topicData.map((t) => [`"${t.topic}"`, t.avgScore, t.students].join(","))
  downloadCSV([headers.join(","), ...rows].join("\n"), `topic-performance-${new Date().toISOString().split("T")[0]}.csv`)
}

/* ------------------------------------------------------------------ */
/*  Build student records from localStorage                            */
/* ------------------------------------------------------------------ */

function loadStudentsFromStorage(): StudentRecord[] {
  try {
    const raw = localStorage.getItem(ALL_RESULTS_KEY)
    if (!raw) return []

    const entries: QuizEntry[] = JSON.parse(raw)
    // Group by userId
    const map: Record<string, StudentRecord> = {}
    entries.forEach((e) => {
      if (!map[e.userId]) {
        map[e.userId] = {
          userId: e.userId,
          name: e.name,
          email: e.email,
          quizResults: [],
          lastActive: e.timestamp,
        }
      }
      map[e.userId].quizResults.push(e)
      if (e.timestamp > map[e.userId].lastActive) {
        map[e.userId].lastActive = e.timestamp
      }
    })

    // Also add registered students with no quizzes
    const usersRaw = localStorage.getItem(USERS_KEY)
    if (usersRaw) {
      const users = JSON.parse(usersRaw)
      users.forEach((u: { id: string; name: string; email: string; role: string }) => {
        if (u.role !== "teacher" && !map[u.id]) {
          map[u.id] = {
            userId: u.id,
            name: u.name,
            email: u.email,
            quizResults: [],
            lastActive: Date.now(),
          }
        }
      })
    }

    return Object.values(map).sort((a, b) => b.lastActive - a.lastActive)
  } catch {
    return []
  }
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function TeacherClient() {
  const [students, setStudents] = useState<StudentRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [refreshing, setRefreshing] = useState(false)

  const loadData = useCallback((showRefresh = false) => {
    if (showRefresh) setRefreshing(true)
    else setLoading(true)
    // Small timeout so the spinner shows for visual feedback
    setTimeout(() => {
      setStudents(loadStudentsFromStorage())
      setLoading(false)
      setRefreshing(false)
    }, 300)
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  /* ---- Computed stats ---- */

  const studentsWithQuizzes = useMemo(
    () => students.filter((s) => s.quizResults.length > 0),
    [students]
  )

  const classStats = useMemo(() => {
    const total = students.length
    const withQuiz = studentsWithQuizzes.length
    if (withQuiz === 0) return { totalStudents: total, avgScore: 0, atRiskCount: 0, engagementRate: 0 }

    const avgScore = Math.round(
      studentsWithQuizzes.reduce((sum, s) => sum + getAvgScore(s), 0) / withQuiz
    )
    const atRiskCount = studentsWithQuizzes.filter((s) => getAvgScore(s) < 50).length
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
    const activeRecently = students.filter((s) => s.lastActive > weekAgo).length
    const engagementRate = total > 0 ? Math.round((activeRecently / total) * 100) : 0

    return { totalStudents: total, avgScore, atRiskCount, engagementRate }
  }, [students, studentsWithQuizzes])

  const topicPerformance = useMemo(() => {
    const topics: Record<string, { correct: number; total: number; students: Set<string> }> = {}
    studentsWithQuizzes.forEach((s) => {
      s.quizResults.forEach((qr) => {
        qr.topicScores.forEach((ts) => {
          if (!topics[ts.topic]) topics[ts.topic] = { correct: 0, total: 0, students: new Set() }
          topics[ts.topic].correct += ts.correct
          topics[ts.topic].total += ts.total
          topics[ts.topic].students.add(s.userId)
        })
      })
    })
    return Object.entries(topics)
      .map(([topic, data]) => ({
        topic,
        avgScore: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
        students: data.students.size,
      }))
      .sort((a, b) => b.avgScore - a.avgScore)
  }, [studentsWithQuizzes])

  const engagementTrend = useMemo(() => {
    const weekMap: Record<string, { quizzes: number; uniqueStudents: Set<string> }> = {}
    studentsWithQuizzes.forEach((s) => {
      s.quizResults.forEach((qr) => {
        const date = new Date(qr.timestamp)
        const weekStart = new Date(date)
        weekStart.setDate(date.getDate() - date.getDay())
        const key = weekStart.toISOString().split("T")[0]
        if (!weekMap[key]) weekMap[key] = { quizzes: 0, uniqueStudents: new Set() }
        weekMap[key].quizzes++
        weekMap[key].uniqueStudents.add(s.userId)
      })
    })
    return Object.entries(weekMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-8)
      .map(([week, data]) => {
        const totalStudents = students.length || 1
        return {
          week: new Date(week).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          engagement: Math.round((data.uniqueStudents.size / totalStudents) * 100),
          quizCompletion: data.quizzes,
        }
      })
  }, [students, studentsWithQuizzes])

  const atRiskStudents = useMemo(() => {
    return studentsWithQuizzes
      .map((s) => {
        const avg = getAvgScore(s)
        const topicTotals: Record<string, { correct: number; total: number }> = {}
        s.quizResults.forEach((qr) => {
          qr.topicScores.forEach((ts) => {
            if (!topicTotals[ts.topic]) topicTotals[ts.topic] = { correct: 0, total: 0 }
            topicTotals[ts.topic].correct += ts.correct
            topicTotals[ts.topic].total += ts.total
          })
        })
        const weakTopics = Object.entries(topicTotals)
          .filter(([, v]) => v.total > 0 && (v.correct / v.total) * 100 < 60)
          .map(([k]) => k)

        return {
          name: s.name,
          email: s.email,
          score: avg,
          quizzes: s.quizResults.length,
          risk: avg < 30 ? "High" : avg < 50 ? "Medium" : "Low",
          weakTopics,
        }
      })
      .filter((s) => s.score < 50)
      .sort((a, b) => a.score - b.score)
  }, [studentsWithQuizzes])

  const weakConcepts = useMemo(() => {
    const topics: Record<string, { correct: number; total: number; students: Set<string> }> = {}
    studentsWithQuizzes.forEach((s) => {
      s.quizResults.forEach((qr) => {
        qr.topicScores.forEach((ts) => {
          if (!topics[ts.topic]) topics[ts.topic] = { correct: 0, total: 0, students: new Set() }
          topics[ts.topic].correct += ts.correct
          topics[ts.topic].total += ts.total
          topics[ts.topic].students.add(s.userId)
        })
      })
    })
    return Object.entries(topics)
      .map(([topic, data]) => ({
        concept: topic,
        failRate: data.total > 0 ? Math.round(((data.total - data.correct) / data.total) * 100) : 0,
        affectedStudents: data.students.size,
      }))
      .filter((c) => c.failRate > 20)
      .sort((a, b) => b.failRate - a.failRate)
  }, [studentsWithQuizzes])

  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return students
    const q = searchQuery.toLowerCase()
    return students.filter(
      (s) => s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q)
    )
  }, [students, searchQuery])

  /* ---- Loading ---- */

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-4 py-20">
        <RefreshCw className="size-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading student data...</p>
      </div>
    )
  }

  /* ---- Main render ---- */

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="flex flex-col gap-6">
      {/* Data source banner */}
      <motion.div variants={fadeUp}>
        <div className="flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
          <div className="flex items-center gap-2">
            <Users className="size-4 text-primary" />
            <span className="text-sm font-medium text-foreground">
              Student Overview
            </span>
            <Badge variant="secondary" className="text-[10px]">
              {students.length} student{students.length !== 1 ? "s" : ""}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => loadData(true)}
            disabled={refreshing}
            className="gap-1.5"
          >
            <RefreshCw className={`size-3.5 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </motion.div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Users, label: "Total Students", value: classStats.totalStudents, suffix: "" },
          { icon: BarChart3, label: "Avg Score", value: classStats.avgScore, suffix: "%" },
          { icon: AlertTriangle, label: "At-Risk Students", value: classStats.atRiskCount, suffix: "", alert: true },
          { icon: Activity, label: "Engagement Rate", value: classStats.engagementRate, suffix: "%" },
        ].map((stat) => (
          <motion.div key={stat.label} variants={fadeUp}>
            <Card className={glassCard}>
              <CardContent className="flex items-center gap-3 py-5">
                <div
                  className={`flex size-10 items-center justify-center rounded-lg ${
                    stat.alert ? "bg-destructive/10" : "bg-primary/10"
                  }`}
                >
                  <stat.icon className={`size-5 ${stat.alert ? "text-destructive" : "text-primary"}`} />
                </div>
                <div>
                  <p className="font-display text-2xl font-bold text-foreground">
                    {stat.value}
                    {stat.suffix}
                  </p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Tabs defaultValue="students">
        <TabsList className="flex-wrap">
          <TabsTrigger value="students" className="gap-1.5">
            <UserCheck className="size-3.5" />
            Student Overview
          </TabsTrigger>
          <TabsTrigger value="performance" className="gap-1.5">
            <BarChart3 className="size-3.5" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="at-risk" className="gap-1.5">
            <AlertTriangle className="size-3.5" />
            At-Risk
          </TabsTrigger>
          <TabsTrigger value="engagement" className="gap-1.5">
            <TrendingUp className="size-3.5" />
            Engagement
          </TabsTrigger>
          <TabsTrigger value="concepts" className="gap-1.5">
            <BookOpen className="size-3.5" />
            Weak Concepts
          </TabsTrigger>
        </TabsList>

        {/* Student Overview */}
        <TabsContent value="students" className="mt-4">
          <Card className={glassCard}>
            <CardHeader className="flex-row items-center justify-between gap-4">
              <div>
                <CardTitle className="font-display">Student Overview</CardTitle>
                <CardDescription>
                  All registered students with quiz performance data
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="shrink-0 gap-1.5"
                onClick={() => exportStudentsCSV(students)}
                disabled={students.length === 0}
              >
                <Download className="size-3.5" />
                Export CSV
              </Button>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-card/50 pl-9"
                  />
                </div>
              </div>

              {filteredStudents.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-12 text-center">
                  <Users className="size-10 text-muted-foreground/50" />
                  <div>
                    <p className="font-display text-sm font-semibold text-foreground">
                      {searchQuery ? "No students match your search" : "No students registered yet"}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {searchQuery
                        ? "Try a different search term."
                        : "Students will appear here after they register and complete quizzes."}
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Desktop table */}
                  <div className="hidden overflow-x-auto md:block">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border text-left text-xs text-muted-foreground">
                          <th className="pb-3 pr-4 font-medium">Student</th>
                          <th className="pb-3 pr-4 font-medium">Email</th>
                          <th className="pb-3 pr-4 font-medium text-center">Quizzes</th>
                          <th className="pb-3 pr-4 font-medium text-center">Latest</th>
                          <th className="pb-3 pr-4 font-medium text-center">Average</th>
                          <th className="pb-3 pr-4 font-medium text-center">Status</th>
                          <th className="pb-3 font-medium">Last Active</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStudents.map((s) => {
                          const latest = getLatestScore(s)
                          const avg = getAvgScore(s)
                          const status = getStatus(avg)
                          return (
                            <tr key={s.userId} className="border-b border-border/50 transition-colors hover:bg-primary/5">
                              <td className="py-3 pr-4">
                                <div className="flex items-center gap-3">
                                  <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                                    {s.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                                  </div>
                                  <span className="font-medium text-foreground">{s.name}</span>
                                </div>
                              </td>
                              <td className="py-3 pr-4 text-muted-foreground">{s.email}</td>
                              <td className="py-3 pr-4 text-center font-medium text-foreground">{s.quizResults.length}</td>
                              <td className="py-3 pr-4 text-center">
                                {s.quizResults.length > 0 ? (
                                  <span className={`font-bold ${latest >= 70 ? "text-primary" : latest >= 50 ? "text-accent" : "text-destructive"}`}>
                                    {latest}%
                                  </span>
                                ) : (
                                  <span className="text-muted-foreground">--</span>
                                )}
                              </td>
                              <td className="py-3 pr-4 text-center">
                                {s.quizResults.length > 0 ? (
                                  <span className={`font-bold ${avg >= 70 ? "text-primary" : avg >= 50 ? "text-accent" : "text-destructive"}`}>
                                    {avg}%
                                  </span>
                                ) : (
                                  <span className="text-muted-foreground">--</span>
                                )}
                              </td>
                              <td className="py-3 pr-4 text-center">
                                {s.quizResults.length > 0 ? (
                                  <Badge variant={status.variant} className="text-[10px]">{status.label}</Badge>
                                ) : (
                                  <Badge variant="outline" className="text-[10px]">No Data</Badge>
                                )}
                              </td>
                              <td className="py-3 text-muted-foreground">{formatDate(s.lastActive)}</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile cards */}
                  <div className="flex flex-col gap-3 md:hidden">
                    {filteredStudents.map((s) => {
                      const latest = getLatestScore(s)
                      const avg = getAvgScore(s)
                      const status = getStatus(avg)
                      return (
                        <div key={s.userId} className="rounded-lg border border-border p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                                {s.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-foreground">{s.name}</p>
                                <p className="text-xs text-muted-foreground">{s.email}</p>
                              </div>
                            </div>
                            {s.quizResults.length > 0 ? (
                              <Badge variant={status.variant} className="text-[10px]">{status.label}</Badge>
                            ) : (
                              <Badge variant="outline" className="text-[10px]">No Data</Badge>
                            )}
                          </div>
                          {s.quizResults.length > 0 && (
                            <div className="mt-3 flex items-center gap-4 text-center text-xs">
                              <div>
                                <p className="font-bold text-foreground">{s.quizResults.length}</p>
                                <p className="text-muted-foreground">Quizzes</p>
                              </div>
                              <div>
                                <p className={`font-bold ${latest >= 70 ? "text-primary" : latest >= 50 ? "text-accent" : "text-destructive"}`}>
                                  {latest}%
                                </p>
                                <p className="text-muted-foreground">Latest</p>
                              </div>
                              <div>
                                <p className={`font-bold ${avg >= 70 ? "text-primary" : avg >= 50 ? "text-accent" : "text-destructive"}`}>
                                  {avg}%
                                </p>
                                <p className="text-muted-foreground">Average</p>
                              </div>
                              <div className="ml-auto text-right">
                                <p className="text-muted-foreground">{formatDate(s.lastActive)}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Heatmap */}
        <TabsContent value="performance" className="mt-4">
          <Card className={glassCard}>
            <CardHeader className="flex-row items-center justify-between">
              <div>
                <CardTitle className="font-display">Topic-wise Performance Heatmap</CardTitle>
                <CardDescription>Average scores by topic across all assessed students</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => exportPerformanceCSV(topicPerformance)}
                disabled={topicPerformance.length === 0}
              >
                <Download className="size-3.5" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              {topicPerformance.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-12 text-center">
                  <BarChart3 className="size-10 text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">
                    No quiz data yet. Performance data will appear after students complete assessments.
                  </p>
                </div>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={topicPerformance} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                      <XAxis dataKey="topic" tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--color-card)",
                          border: "1px solid var(--color-border)",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                        formatter={(value: number) => [`${value}%`, "Avg Score"]}
                      />
                      <Bar dataKey="avgScore" name="Avg Score %" radius={[4, 4, 0, 0]}>
                        {topicPerformance.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={getBarColor(entry.avgScore)} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="mt-4 flex items-center gap-6 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <span className="size-3 rounded-sm bg-chart-1" />
                      {"Strong (75%+)"}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="size-3 rounded-sm bg-chart-2" />
                      {"Average (60-74%)"}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="size-3 rounded-sm bg-destructive" />
                      {"Weak (<60%)"}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* At-Risk Students */}
        <TabsContent value="at-risk" className="mt-4">
          <Card className={glassCard}>
            <CardHeader className="flex-row items-center justify-between">
              <div>
                <CardTitle className="font-display">At-Risk Student Predictions</CardTitle>
                <CardDescription>Students scoring below 50% who may need intervention</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => exportAtRiskCSV(students)}
                disabled={atRiskStudents.length === 0}
              >
                <Download className="size-3.5" />
                Export Report
              </Button>
            </CardHeader>
            <CardContent>
              {atRiskStudents.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-12 text-center">
                  <UserCheck className="size-10 text-primary/50" />
                  <div>
                    <p className="font-display text-sm font-semibold text-foreground">No at-risk students detected</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      All assessed students are scoring above 50%. Great progress!
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {atRiskStudents.map((student) => (
                    <div key={student.email} className="flex items-center gap-4 rounded-lg border border-border p-4">
                      <div className="flex size-10 items-center justify-center rounded-full bg-muted text-sm font-bold text-foreground">
                        {student.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-semibold text-foreground">{student.name}</h4>
                          <Badge
                            variant={student.risk === "High" ? "destructive" : student.risk === "Medium" ? "secondary" : "outline"}
                            className="text-[10px]"
                          >
                            {student.risk} Risk
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{student.email}</p>
                        {student.weakTopics.length > 0 && (
                          <div className="mt-1.5 flex flex-wrap gap-1">
                            {student.weakTopics.map((t) => (
                              <Badge key={t} variant="outline" className="text-[10px]">{t}</Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-6 text-center">
                        <div>
                          <p className="text-sm font-bold text-foreground">{student.score}%</p>
                          <p className="text-[10px] text-muted-foreground">Avg Score</p>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground">{student.quizzes}</p>
                          <p className="text-[10px] text-muted-foreground">Quizzes</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Engagement Tracking */}
        <TabsContent value="engagement" className="mt-4">
          <Card className={glassCard}>
            <CardHeader>
              <CardTitle className="font-display">Engagement & Quiz Activity Trend</CardTitle>
              <CardDescription>Weekly tracking of student engagement and quiz submission counts</CardDescription>
            </CardHeader>
            <CardContent>
              {engagementTrend.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-12 text-center">
                  <TrendingUp className="size-10 text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">
                    No engagement data yet. Trends will appear after students complete quizzes over time.
                  </p>
                </div>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={engagementTrend} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                      <XAxis dataKey="week" tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} />
                      <YAxis tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--color-card)",
                          border: "1px solid var(--color-border)",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="engagement"
                        name="Engagement %"
                        stroke="var(--color-primary)"
                        strokeWidth={2}
                        dot={{ fill: "var(--color-primary)", r: 4 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="quizCompletion"
                        name="Quizzes Submitted"
                        stroke="var(--color-accent)"
                        strokeWidth={2}
                        dot={{ fill: "var(--color-accent)", r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                  <div className="mt-4 flex items-center gap-6 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <span className="size-3 rounded-sm bg-primary" />
                      Engagement Rate
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="size-3 rounded-sm bg-accent" />
                      Quizzes Submitted
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Weak Concepts */}
        <TabsContent value="concepts" className="mt-4">
          <Card className={glassCard}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-display">
                <Clock className="size-5 text-primary" />
                Weak Concept Clusters
              </CardTitle>
              <CardDescription>Topics with the highest failure rates requiring focused instruction</CardDescription>
            </CardHeader>
            <CardContent>
              {weakConcepts.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-12 text-center">
                  <BookOpen className="size-10 text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">
                    No weak concept data yet. Data will appear after students complete assessments.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {weakConcepts.map((concept) => (
                    <div key={concept.concept} className="rounded-lg border border-border p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-semibold text-foreground">{concept.concept}</h4>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-destructive">{concept.failRate}% fail</p>
                          <p className="text-[10px] text-muted-foreground">
                            {concept.affectedStudents} student{concept.affectedStudents !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                      <Progress value={100 - concept.failRate} className="mt-3" />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
