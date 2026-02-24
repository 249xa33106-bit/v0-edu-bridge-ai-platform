"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Route, Sparkles, ArrowRight, CheckCircle2, BookOpen, Code, Target, Clock } from "lucide-react"

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] } },
}
const glassCard = "rounded-2xl border border-white/[0.12] bg-white/[0.06] shadow-lg shadow-black/[0.04] backdrop-blur-xl"

type Week = {
  week: number
  topic: string
  subtopics: string[]
  practiceType: string
  status: "completed" | "current" | "upcoming"
}

const studyPlans: Record<string, Week[]> = {
  "data-analyst": [
    { week: 1, topic: "Python Fundamentals", subtopics: ["Variables & Data Types", "Control Flow", "Functions"], practiceType: "Coding exercises", status: "completed" },
    { week: 2, topic: "Data Manipulation with Pandas", subtopics: ["DataFrames", "Filtering & Grouping", "Merge & Join"], practiceType: "Dataset analysis", status: "completed" },
    { week: 3, topic: "Data Visualization", subtopics: ["Matplotlib", "Seaborn", "Dashboard Design"], practiceType: "Build 3 visualizations", status: "current" },
    { week: 4, topic: "SQL for Analytics", subtopics: ["Complex Queries", "Window Functions", "Optimization"], practiceType: "SQL challenges", status: "upcoming" },
    { week: 5, topic: "Statistics & Probability", subtopics: ["Hypothesis Testing", "Distributions", "Regression"], practiceType: "Statistical analysis project", status: "upcoming" },
    { week: 6, topic: "Machine Learning Basics", subtopics: ["Supervised Learning", "Model Evaluation", "Scikit-learn"], practiceType: "ML mini-project", status: "upcoming" },
    { week: 7, topic: "Business Intelligence", subtopics: ["KPI Design", "A/B Testing", "Reporting"], practiceType: "Case study presentation", status: "upcoming" },
    { week: 8, topic: "Portfolio & Interview Prep", subtopics: ["GitHub Portfolio", "Mock Interviews", "Resume"], practiceType: "Mock assessment", status: "upcoming" },
  ],
  "web-developer": [
    { week: 1, topic: "HTML & CSS Mastery", subtopics: ["Semantic HTML", "Flexbox & Grid", "Responsive Design"], practiceType: "Build landing page", status: "completed" },
    { week: 2, topic: "JavaScript Fundamentals", subtopics: ["ES6+", "DOM Manipulation", "Async/Await"], practiceType: "Interactive components", status: "completed" },
    { week: 3, topic: "React Fundamentals", subtopics: ["Components", "Hooks", "State Management"], practiceType: "Build React app", status: "current" },
    { week: 4, topic: "Next.js & Full-Stack", subtopics: ["Server Components", "API Routes", "Database"], practiceType: "Full-stack project", status: "upcoming" },
    { week: 5, topic: "Backend with Node.js", subtopics: ["Express", "Authentication", "REST APIs"], practiceType: "Build REST API", status: "upcoming" },
    { week: 6, topic: "Database & ORM", subtopics: ["PostgreSQL", "Prisma", "Data Modeling"], practiceType: "Database design", status: "upcoming" },
    { week: 7, topic: "DevOps & Deployment", subtopics: ["Git", "CI/CD", "Vercel/AWS"], practiceType: "Deploy project", status: "upcoming" },
    { week: 8, topic: "Portfolio & Interview", subtopics: ["3 Projects", "DSA Basics", "System Design"], practiceType: "Mock interviews", status: "upcoming" },
  ],
  "ml-engineer": [
    { week: 1, topic: "Python for ML", subtopics: ["NumPy", "Pandas", "Matplotlib"], practiceType: "Data analysis", status: "completed" },
    { week: 2, topic: "Mathematics Foundation", subtopics: ["Linear Algebra", "Calculus", "Probability"], practiceType: "Problem sets", status: "current" },
    { week: 3, topic: "Supervised Learning", subtopics: ["Regression", "Classification", "Evaluation"], practiceType: "Kaggle competition", status: "upcoming" },
    { week: 4, topic: "Unsupervised Learning", subtopics: ["Clustering", "Dimensionality Reduction", "Anomaly Detection"], practiceType: "Clustering project", status: "upcoming" },
    { week: 5, topic: "Deep Learning", subtopics: ["Neural Networks", "CNNs", "RNNs"], practiceType: "Image classifier", status: "upcoming" },
    { week: 6, topic: "NLP Fundamentals", subtopics: ["Text Processing", "Transformers", "Sentiment Analysis"], practiceType: "NLP project", status: "upcoming" },
    { week: 7, topic: "MLOps & Deployment", subtopics: ["Model Serving", "Docker", "Monitoring"], practiceType: "Deploy ML model", status: "upcoming" },
    { week: 8, topic: "Capstone Project", subtopics: ["End-to-End ML Pipeline", "Documentation", "Presentation"], practiceType: "Full project", status: "upcoming" },
  ],
}

const skillGaps: Record<string, { skill: string; current: number; required: number }[]> = {
  "data-analyst": [
    { skill: "Python", current: 45, required: 80 },
    { skill: "SQL", current: 30, required: 85 },
    { skill: "Statistics", current: 25, required: 75 },
    { skill: "Visualization", current: 40, required: 70 },
    { skill: "ML Basics", current: 15, required: 60 },
  ],
  "web-developer": [
    { skill: "HTML/CSS", current: 60, required: 90 },
    { skill: "JavaScript", current: 40, required: 85 },
    { skill: "React", current: 20, required: 80 },
    { skill: "Backend", current: 15, required: 70 },
    { skill: "Databases", current: 25, required: 65 },
  ],
  "ml-engineer": [
    { skill: "Python", current: 50, required: 90 },
    { skill: "Mathematics", current: 35, required: 80 },
    { skill: "ML Algorithms", current: 20, required: 85 },
    { skill: "Deep Learning", current: 10, required: 75 },
    { skill: "MLOps", current: 5, required: 60 },
  ],
}

export function StudyPlanClient() {
  const [role, setRole] = useState("data-analyst")
  const [level, setLevel] = useState("beginner")
  const [hours, setHours] = useState("10")
  const [generated, setGenerated] = useState(false)
  const [generating, setGenerating] = useState(false)

  const plan = studyPlans[role] || studyPlans["data-analyst"]
  const gaps = skillGaps[role] || skillGaps["data-analyst"]
  const completedWeeks = plan.filter((w) => w.status === "completed").length
  const progressPct = Math.round((completedWeeks / plan.length) * 100)

  const handleGenerate = () => {
    setGenerating(true)
    setTimeout(() => {
      setGenerated(true)
      setGenerating(false)
    }, 1500)
  }

  if (!generated) {
    return (
      <motion.div initial="hidden" animate="visible" variants={stagger} className="flex justify-center">
      <Card className={`${glassCard} mx-auto max-w-lg`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display">
            <Route className="size-5 text-primary" />
            Configure Your Study Plan
          </CardTitle>
          <CardDescription>Tell us about your goals and availability</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Target Role</label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="data-analyst">Data Analyst</SelectItem>
                <SelectItem value="web-developer">Web Developer</SelectItem>
                <SelectItem value="ml-engineer">ML Engineer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Current Skill Level</label>
            <Select value={level} onValueChange={setLevel}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Weekly Hours Available</label>
            <Select value={hours} onValueChange={setHours}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 hours/week</SelectItem>
                <SelectItem value="10">10 hours/week</SelectItem>
                <SelectItem value="15">15 hours/week</SelectItem>
                <SelectItem value="20">20+ hours/week</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleGenerate} disabled={generating} className="gap-2">
            <Sparkles className="size-4" />
            {generating ? "Generating Plan..." : "Generate Study Plan"}
          </Button>
        </CardContent>
      </Card>
      </motion.div>
    )
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="flex flex-col gap-6">
      {/* Progress Overview */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Card className={glassCard}>
          <CardContent className="flex items-center gap-3 py-5">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <Target className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground capitalize">{role.replace("-", " ")}</p>
              <p className="text-xs text-muted-foreground">Target Role</p>
            </div>
          </CardContent>
        </Card>
        <Card className={glassCard}>
          <CardContent className="flex items-center gap-3 py-5">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <Clock className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{plan.length} Weeks</p>
              <p className="text-xs text-muted-foreground">Duration</p>
            </div>
          </CardContent>
        </Card>
        <Card className={glassCard}>
          <CardContent className="flex items-center gap-3 py-5">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <BookOpen className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{hours}h/week</p>
              <p className="text-xs text-muted-foreground">Time Commitment</p>
            </div>
          </CardContent>
        </Card>
        <Card className={glassCard}>
          <CardContent className="flex flex-col gap-2 py-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">{progressPct}% Complete</p>
              <p className="text-xs text-muted-foreground">{completedWeeks}/{plan.length} weeks</p>
            </div>
            <Progress value={progressPct} />
          </CardContent>
        </Card>
      </div>

      {/* Skill Gap Visualization */}
      <Card className={glassCard}>
        <CardHeader>
          <CardTitle className="font-display">Skill Gap Analysis</CardTitle>
          <CardDescription>Current level vs. required level for your target role</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-5">
            {gaps.map((gap) => (
              <div key={gap.skill} className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{gap.skill}</span>
                  <span className="text-xs text-muted-foreground">
                    {gap.current}% / {gap.required}% required
                  </span>
                </div>
                <div className="relative h-3 rounded-full bg-muted overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-primary/30"
                    style={{ width: `${gap.required}%` }}
                  />
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-primary transition-all"
                    style={{ width: `${gap.current}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <span className="size-3 rounded-sm bg-primary" />
              Current Level
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-3 rounded-sm bg-primary/30" />
              Required Level
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Roadmap */}
      <Card className={glassCard}>
        <CardHeader>
          <CardTitle className="font-display">Weekly Roadmap</CardTitle>
          <CardDescription>Your personalized 8-week study plan with practice schedules</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            {plan.map((week) => (
              <div
                key={week.week}
                className={`flex gap-4 rounded-lg border p-4 ${
                  week.status === "current"
                    ? "border-primary bg-primary/5"
                    : week.status === "completed"
                      ? "border-border bg-muted/50"
                      : "border-border"
                }`}
              >
                <div className="flex flex-col items-center">
                  <span className={`flex size-8 items-center justify-center rounded-full text-xs font-bold ${
                    week.status === "completed"
                      ? "bg-primary text-primary-foreground"
                      : week.status === "current"
                        ? "border-2 border-primary bg-card text-primary"
                        : "bg-muted text-muted-foreground"
                  }`}>
                    {week.status === "completed" ? <CheckCircle2 className="size-4" /> : week.week}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-display text-sm font-semibold text-foreground">{week.topic}</h4>
                    {week.status === "current" && (
                      <Badge variant="default" className="text-[10px]">Current</Badge>
                    )}
                    {week.status === "completed" && (
                      <Badge variant="secondary" className="text-[10px]">Done</Badge>
                    )}
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {week.subtopics.map((st) => (
                      <Badge key={st} variant="outline" className="text-[10px]">{st}</Badge>
                    ))}
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Code className="size-3" />
                    {week.practiceType}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button variant="outline" onClick={() => setGenerated(false)} className="gap-2">
          <Route className="size-4" />
          Reconfigure Plan
        </Button>
        <Button asChild className="gap-2">
          <a href="/career">
            View Career Intelligence
            <ArrowRight className="size-4" />
          </a>
        </Button>
      </div>
    </motion.div>
  )
}
