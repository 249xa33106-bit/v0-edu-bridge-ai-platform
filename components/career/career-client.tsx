"use client"

import { useState } from "react"
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
import { BarChart3, BookOpen, Award, ExternalLink, Target, TrendingUp, Briefcase } from "lucide-react"

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] } },
}
const glassCard = "rounded-2xl border border-white/[0.12] bg-white/[0.06] shadow-lg shadow-black/[0.04] backdrop-blur-xl"

const roles = [
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

export function CareerClient() {
  const [selectedRole, setSelectedRole] = useState(roles[0])

  return (
    <div className="flex flex-col gap-6">
      {/* Role Selector */}
      <div className="flex flex-wrap gap-3">
        {roles.map((role) => (
          <Button
            key={role.id}
            variant={selectedRole.id === role.id ? "default" : "outline"}
            onClick={() => setSelectedRole(role)}
            className="gap-2"
          >
            <Briefcase className="size-4" />
            {role.title}
          </Button>
        ))}
      </div>

      {/* Readiness Score + Radar Chart */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border-border">
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
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
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
      </div>

      {/* Priority Skill Gaps */}
      <Card className="border-border">
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

      {/* Recommended Courses */}
      <Card className="border-border">
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

      {/* Projects & Certifications */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border-border">
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

        <Card className="border-border">
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
      </div>
    </div>
  )
}
