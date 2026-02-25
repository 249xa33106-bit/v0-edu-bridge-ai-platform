"use client"

import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { BarChart3, BookOpen, Award, ExternalLink, Target, TrendingUp, Briefcase, Brain, ArrowRight } from "lucide-react"

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] } },
}
const glassCard = "rounded-2xl border border-white/[0.12] bg-white/[0.06] shadow-lg shadow-black/[0.04] backdrop-blur-xl"

const QUIZ_STORAGE_KEY = "edubridge_quiz_results"

interface QuizResult {
  topicScores: { topic: string; correct: number; total: number }[]
  totalCorrect: number
  totalQuestions: number
  timestamp: number
  material?: string
}

// Map quiz topics to career role skill subjects
const topicToSkillMap: Record<string, Record<string, string[]>> = {
  "data-analyst": {
    "Data Structures": ["Python"],
    Algorithms: ["Python", "ML Basics"],
    OOP: ["Python"],
    Databases: ["SQL"],
    Networking: ["Communication"],
  },
  "web-developer": {
    "Data Structures": ["JavaScript", "Backend"],
    Algorithms: ["JavaScript"],
    OOP: ["React", "Backend"],
    Databases: ["Databases"],
    Networking: ["DevOps", "Backend"],
  },
}

const baseRoles = [
  {
    id: "data-analyst",
    title: "Data Analyst",
    readiness: 48,
    skills: [
      { subject: "Python", student: 55, industry: 80 },
      { subject: "SQL", student: 40, industry: 85 },
      { subject: "Statistics", student: 35, industry: 75 },
      { subject: "Visualization", student: 50, industry: 70 },
      { subject: "ML Basics", student: 25, industry: 60 },
      { subject: "Communication", student: 70, industry: 65 },
    ],
    gaps: [
      { skill: "SQL Advanced Queries", priority: "High", suggestion: "Complete LeetCode SQL 50 challenge" },
      { skill: "Statistical Testing", priority: "High", suggestion: "Take Khan Academy Statistics course" },
      { skill: "ML Foundations", priority: "Medium", suggestion: "Complete Andrew Ng's ML Specialization" },
      { skill: "Tableau/Power BI", priority: "Medium", suggestion: "Build 5 dashboards with real datasets" },
    ],
    courses: [
      { name: "Google Data Analytics Certificate", provider: "Coursera", duration: "6 months", match: 92 },
      { name: "SQL for Data Science", provider: "Coursera", duration: "4 weeks", match: 88 },
      { name: "Statistics with Python", provider: "Coursera", duration: "5 months", match: 85 },
    ],
    certifications: [
      { name: "Google Data Analytics Professional", difficulty: "Intermediate" },
      { name: "Microsoft Power BI Data Analyst", difficulty: "Intermediate" },
      { name: "AWS Certified Cloud Practitioner", difficulty: "Beginner" },
    ],
    projects: [
      { name: "E-commerce Sales Dashboard", skills: ["Python", "SQL", "Visualization"], difficulty: "Beginner" },
      { name: "Customer Churn Prediction", skills: ["ML", "Statistics", "Python"], difficulty: "Intermediate" },
      { name: "A/B Test Analysis Pipeline", skills: ["Statistics", "SQL", "Python"], difficulty: "Advanced" },
    ],
  },
  {
    id: "web-developer",
    title: "Full-Stack Web Developer",
    readiness: 38,
    skills: [
      { subject: "HTML/CSS", student: 65, industry: 90 },
      { subject: "JavaScript", student: 45, industry: 85 },
      { subject: "React", student: 25, industry: 80 },
      { subject: "Backend", student: 20, industry: 75 },
      { subject: "Databases", student: 30, industry: 70 },
      { subject: "DevOps", student: 10, industry: 55 },
    ],
    gaps: [
      { skill: "React & Next.js", priority: "High", suggestion: "Build 3 projects with Next.js App Router" },
      { skill: "Node.js/Express", priority: "High", suggestion: "Build REST API with authentication" },
      { skill: "Database Design", priority: "Medium", suggestion: "Complete PostgreSQL course on Udemy" },
      { skill: "TypeScript", priority: "Medium", suggestion: "Convert existing JS projects to TypeScript" },
    ],
    courses: [
      { name: "The Odin Project", provider: "Free", duration: "6+ months", match: 95 },
      { name: "Full-Stack Open", provider: "University of Helsinki", duration: "3 months", match: 90 },
      { name: "Next.js Official Tutorial", provider: "Vercel", duration: "2 weeks", match: 88 },
    ],
    certifications: [
      { name: "Meta Front-End Developer", difficulty: "Intermediate" },
      { name: "AWS Solutions Architect", difficulty: "Advanced" },
    ],
    projects: [
      { name: "Personal Portfolio Site", skills: ["HTML/CSS", "JavaScript", "React"], difficulty: "Beginner" },
      { name: "Task Management App", skills: ["React", "Node.js", "PostgreSQL"], difficulty: "Intermediate" },
      { name: "Real-time Chat Application", skills: ["WebSockets", "React", "Node.js"], difficulty: "Advanced" },
    ],
  },
]

function applyQuizToRole(
  role: (typeof baseRoles)[0],
  quizResult: QuizResult
) {
  const mapping = topicToSkillMap[role.id]
  if (!mapping) return role

  // Build quiz accuracy per topic
  const topicAccuracy: Record<string, number> = {}
  for (const ts of quizResult.topicScores) {
    topicAccuracy[ts.topic] = ts.total > 0 ? (ts.correct / ts.total) * 100 : 0
  }

  // Update skills based on quiz
  const updatedSkills = role.skills.map((skill) => {
    // Find which quiz topics map to this skill
    const matchingTopics: string[] = []
    for (const [quizTopic, skillSubjects] of Object.entries(mapping)) {
      if (skillSubjects.includes(skill.subject) && topicAccuracy[quizTopic] !== undefined) {
        matchingTopics.push(quizTopic)
      }
    }

    if (matchingTopics.length === 0) return skill

    // Average the accuracy from matching quiz topics
    const avgQuizAccuracy =
      matchingTopics.reduce((sum, t) => sum + topicAccuracy[t], 0) / matchingTopics.length

    // Blend: 40% original + 60% quiz-derived (quiz has more weight)
    const blended = Math.round(skill.student * 0.4 + avgQuizAccuracy * 0.6)
    return { ...skill, student: Math.min(100, Math.max(0, blended)) }
  })

  // Recompute readiness as weighted average: how close student is to industry for each skill
  const totalWeight = updatedSkills.reduce((s, sk) => s + sk.industry, 0)
  const weightedScore = updatedSkills.reduce((s, sk) => {
    const ratio = Math.min(1, sk.student / sk.industry)
    return s + ratio * sk.industry
  }, 0)
  const newReadiness = Math.round((weightedScore / totalWeight) * 100)

  return {
    ...role,
    skills: updatedSkills,
    readiness: newReadiness,
  }
}

export function CareerClient() {
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null)
  const [selectedRoleId, setSelectedRoleId] = useState(baseRoles[0].id)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(QUIZ_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as QuizResult
        if (parsed.topicScores && parsed.totalCorrect !== undefined) {
          setQuizResult(parsed)
        }
      }
    } catch {
      // Silently fail
    }
  }, [])

  const roles = useMemo(() => {
    if (!quizResult) return baseRoles
    return baseRoles.map((role) => applyQuizToRole(role, quizResult))
  }, [quizResult])

  const selectedRole = roles.find((r) => r.id === selectedRoleId) || roles[0]
  const quizAccuracy = quizResult
    ? Math.round((quizResult.totalCorrect / quizResult.totalQuestions) * 100)
    : null

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="flex flex-col gap-6">
      {/* Quiz data banner */}
      {quizResult ? (
        <motion.div variants={fadeUp}>
          <div className="flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
            <Brain className="size-5 text-primary" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">
                Updated from your latest assessment
              </p>
              <p className="text-xs text-muted-foreground">
                Quiz score: {quizResult.totalCorrect}/{quizResult.totalQuestions} ({quizAccuracy}% accuracy) -- Taken {new Date(quizResult.timestamp).toLocaleDateString()}
              </p>
            </div>
            <Badge variant="default" className="shrink-0">
              Live Data
            </Badge>
          </div>
        </motion.div>
      ) : (
        <motion.div variants={fadeUp}>
          <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3">
            <Brain className="size-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">
                No assessment data yet
              </p>
              <p className="text-xs text-muted-foreground">
                Take the diagnostic assessment to get personalized career readiness scores based on your actual skill levels.
              </p>
            </div>
            <Button asChild variant="outline" size="sm" className="shrink-0 gap-1.5">
              <a href="/diagnostic">
                Take Quiz
                <ArrowRight className="size-3.5" />
              </a>
            </Button>
          </div>
        </motion.div>
      )}

      {/* Role Selector */}
      <div className="flex flex-wrap gap-3">
        {roles.map((role) => (
          <Button
            key={role.id}
            variant={selectedRoleId === role.id ? "default" : "outline"}
            onClick={() => setSelectedRoleId(role.id)}
            className="gap-2"
          >
            <Briefcase className="size-4" />
            {role.title}
          </Button>
        ))}
      </div>

      {/* Readiness Score + Radar Chart */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className={glassCard}>
          <CardHeader>
            <CardTitle className="font-display">Career Readiness Score</CardTitle>
            <CardDescription>Overall preparedness for {selectedRole.title}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <div className="relative flex size-40 items-center justify-center">
              <svg className="size-full -rotate-90" viewBox="0 0 160 160">
                <circle cx="80" cy="80" r="70" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted" />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray={`${(selectedRole.readiness / 100) * 440} 440`}
                  strokeLinecap="round"
                  className="text-primary"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="font-display text-3xl font-bold text-foreground">{selectedRole.readiness}%</span>
                <span className="text-xs text-muted-foreground">Ready</span>
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                {selectedRole.readiness >= 70
                  ? "You are well-positioned for this role!"
                  : selectedRole.readiness >= 40
                    ? "Good progress! Focus on the priority skill gaps below."
                    : "Building foundations. Follow the recommended learning path."}
              </p>
              {quizResult && (
                <p className="mt-1 text-xs text-primary">
                  Score adjusted from quiz accuracy ({quizAccuracy}%)
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className={glassCard}>
          <CardHeader>
            <CardTitle className="font-display">Skill Gap Radar Chart</CardTitle>
            <CardDescription>Your skills vs. industry requirements</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={selectedRole.skills}>
                <PolarGrid stroke="var(--color-border)" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="Your Skills"
                  dataKey="student"
                  stroke="var(--color-primary)"
                  fill="var(--color-primary)"
                  fillOpacity={0.25}
                  strokeWidth={2}
                />
                <Radar
                  name="Industry Required"
                  dataKey="industry"
                  stroke="var(--color-accent)"
                  fill="var(--color-accent)"
                  fillOpacity={0.1}
                  strokeWidth={2}
                  strokeDasharray="4 4"
                />
                <Legend
                  wrapperStyle={{ fontSize: "12px" }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Priority Skill Gaps */}
      <motion.div variants={fadeUp}>
        <Card className={glassCard}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display">
              <Target className="size-5 text-primary" />
              Priority Skill Gaps
            </CardTitle>
            <CardDescription>Actionable steps to close the gap for {selectedRole.title}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {selectedRole.gaps.map((gap) => (
                <div key={gap.skill} className="rounded-lg border border-border p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-foreground">{gap.skill}</h4>
                    <Badge variant={gap.priority === "High" ? "destructive" : "secondary"}>
                      {gap.priority}
                    </Badge>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">{gap.suggestion}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recommended Courses */}
      <motion.div variants={fadeUp}>
        <Card className={glassCard}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display">
              <BookOpen className="size-5 text-primary" />
              Recommended Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {selectedRole.courses.map((course) => (
                <div key={course.name} className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-foreground">{course.name}</h4>
                    <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{course.provider}</span>
                      <span>{course.duration}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-sm font-bold text-primary">{course.match}%</span>
                      <p className="text-[10px] text-muted-foreground">match</p>
                    </div>
                    <Button variant="ghost" size="icon" aria-label="Open course">
                      <ExternalLink className="size-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Projects & Certifications */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className={glassCard}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display">
              <TrendingUp className="size-5 text-primary" />
              Suggested Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {selectedRole.projects.map((project) => (
                <div key={project.name} className="rounded-lg border border-border p-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-foreground">{project.name}</h4>
                    <Badge variant="outline" className="text-[10px]">{project.difficulty}</Badge>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {project.skills.map((s) => (
                      <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className={glassCard}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display">
              <Award className="size-5 text-primary" />
              Certifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {selectedRole.certifications.map((cert) => (
                <div key={cert.name} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <h4 className="text-sm font-medium text-foreground">{cert.name}</h4>
                    <p className="mt-0.5 text-xs text-muted-foreground">{cert.difficulty}</p>
                  </div>
                  <Button variant="ghost" size="icon" aria-label="View certification">
                    <ExternalLink className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
