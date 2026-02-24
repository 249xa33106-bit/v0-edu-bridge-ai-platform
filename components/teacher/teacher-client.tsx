"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
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
} from "lucide-react"

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] } },
}
const glassCard = "rounded-2xl border border-white/[0.12] bg-white/[0.06] shadow-lg shadow-black/[0.04] backdrop-blur-xl"

const classStats = {
  totalStudents: 64,
  avgScore: 67,
  atRiskCount: 8,
  engagementRate: 74,
}

const topicPerformance = [
  { topic: "Data Structures", avgScore: 78, students: 64 },
  { topic: "Algorithms", avgScore: 62, students: 64 },
  { topic: "OOP", avgScore: 71, students: 64 },
  { topic: "Databases", avgScore: 55, students: 64 },
  { topic: "Networking", avgScore: 48, students: 64 },
  { topic: "OS Concepts", avgScore: 65, students: 64 },
]

const engagementTrend = [
  { week: "W1", engagement: 82, quizCompletion: 90 },
  { week: "W2", engagement: 78, quizCompletion: 85 },
  { week: "W3", engagement: 75, quizCompletion: 80 },
  { week: "W4", engagement: 71, quizCompletion: 72 },
  { week: "W5", engagement: 68, quizCompletion: 68 },
  { week: "W6", engagement: 74, quizCompletion: 75 },
  { week: "W7", engagement: 79, quizCompletion: 82 },
  { week: "W8", engagement: 83, quizCompletion: 88 },
]

const atRiskStudents = [
  { name: "Ravi K.", score: 32, attendance: 45, risk: "High", weakTopics: ["Networking", "Databases"] },
  { name: "Priya M.", score: 38, attendance: 55, risk: "High", weakTopics: ["Algorithms", "OS Concepts"] },
  { name: "Anil S.", score: 41, attendance: 60, risk: "Medium", weakTopics: ["Databases"] },
  { name: "Deepa R.", score: 42, attendance: 50, risk: "High", weakTopics: ["Networking", "Algorithms"] },
  { name: "Suresh V.", score: 44, attendance: 65, risk: "Medium", weakTopics: ["OS Concepts"] },
  { name: "Kavitha L.", score: 45, attendance: 58, risk: "Medium", weakTopics: ["Databases", "OOP"] },
  { name: "Ramesh T.", score: 46, attendance: 70, risk: "Low", weakTopics: ["Networking"] },
  { name: "Lakshmi B.", score: 47, attendance: 62, risk: "Low", weakTopics: ["Algorithms"] },
]

const weakConcepts = [
  { concept: "TCP/IP Protocol Stack", topic: "Networking", failRate: 72, affectedStudents: 46 },
  { concept: "SQL Joins & Subqueries", topic: "Databases", failRate: 65, affectedStudents: 42 },
  { concept: "Dynamic Programming", topic: "Algorithms", failRate: 61, affectedStudents: 39 },
  { concept: "Process Scheduling", topic: "OS Concepts", failRate: 55, affectedStudents: 35 },
  { concept: "Normalization (3NF)", topic: "Databases", failRate: 52, affectedStudents: 33 },
]

function getBarColor(score: number) {
  if (score >= 75) return "var(--color-chart-1)"
  if (score >= 60) return "var(--color-chart-2)"
  return "var(--color-destructive)"
}

export function TeacherClient() {
  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="flex flex-col gap-6">
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
              <div className={`flex size-10 items-center justify-center rounded-lg ${stat.alert ? "bg-destructive/10" : "bg-primary/10"}`}>
                <stat.icon className={`size-5 ${stat.alert ? "text-destructive" : "text-primary"}`} />
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-foreground">
                  {stat.value}{stat.suffix}
                </p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </CardContent>
          </Card>
          </motion.div>
        ))}
      </div>

      <Tabs defaultValue="performance">
        <TabsList>
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

        {/* Performance Heatmap */}
        <TabsContent value="performance" className="mt-4">
          <Card className={glassCard}>
            <CardHeader className="flex-row items-center justify-between">
              <div>
                <CardTitle className="font-display">Topic-wise Performance Heatmap</CardTitle>
                <CardDescription>Average scores by topic across the entire class</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Download className="size-3.5" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
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
                  Strong (75%+)
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="size-3 rounded-sm bg-chart-2" />
                  Average (60-74%)
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="size-3 rounded-sm bg-destructive" />
                  {"Weak (<60%)"}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* At-Risk Students */}
        <TabsContent value="at-risk" className="mt-4">
          <Card className={glassCard}>
            <CardHeader className="flex-row items-center justify-between">
              <div>
                <CardTitle className="font-display">At-Risk Student Predictions</CardTitle>
                <CardDescription>ML-based early warning system identifying students who may need intervention</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Download className="size-3.5" />
                Export Report
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                {atRiskStudents.map((student) => (
                  <div key={student.name} className="flex items-center gap-4 rounded-lg border border-border p-4">
                    <div className="flex size-10 items-center justify-center rounded-full bg-muted text-sm font-bold text-foreground">
                      {student.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-foreground">{student.name}</h4>
                        <Badge
                          variant={
                            student.risk === "High" ? "destructive" : student.risk === "Medium" ? "secondary" : "outline"
                          }
                          className="text-[10px]"
                        >
                          {student.risk} Risk
                        </Badge>
                      </div>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {student.weakTopics.map((t) => (
                          <Badge key={t} variant="outline" className="text-[10px]">{t}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-center">
                      <div>
                        <p className="text-sm font-bold text-foreground">{student.score}%</p>
                        <p className="text-[10px] text-muted-foreground">Score</p>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">{student.attendance}%</p>
                        <p className="text-[10px] text-muted-foreground">Attend.</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Engagement Tracking */}
        <TabsContent value="engagement" className="mt-4">
          <Card className={glassCard}>
            <CardHeader>
              <CardTitle className="font-display">Engagement & Quiz Completion Trend</CardTitle>
              <CardDescription>Weekly tracking of student engagement and assessment completion rates</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={engagementTrend} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="week" tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} />
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
                    name="Quiz Completion %"
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
                  Quiz Completion
                </div>
              </div>
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
              <CardDescription>Concepts with the highest failure rates requiring focused instruction</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                {weakConcepts.map((concept) => (
                  <div key={concept.concept} className="rounded-lg border border-border p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-semibold text-foreground">{concept.concept}</h4>
                        <Badge variant="outline" className="mt-1 text-[10px]">{concept.topic}</Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-destructive">{concept.failRate}% fail</p>
                        <p className="text-[10px] text-muted-foreground">{concept.affectedStudents} students</p>
                      </div>
                    </div>
                    <Progress value={100 - concept.failRate} className="mt-3" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
