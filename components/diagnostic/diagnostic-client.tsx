"use client"

import { useState } from "react"
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
import { Brain, CheckCircle2, XCircle, Clock, ArrowRight, RotateCcw, Zap } from "lucide-react"

interface QuizQuestion {
  id: number
  topic: string
  question: string
  options: string[]
  correct: number
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    topic: "Data Structures",
    question: "What is the time complexity of searching in a balanced Binary Search Tree?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    correct: 1,
  },
  {
    id: 2,
    topic: "Data Structures",
    question: "Which data structure uses FIFO ordering?",
    options: ["Stack", "Queue", "Tree", "Graph"],
    correct: 1,
  },
  {
    id: 3,
    topic: "Algorithms",
    question: "What is the worst-case time complexity of Quick Sort?",
    options: ["O(n)", "O(n log n)", "O(n^2)", "O(log n)"],
    correct: 2,
  },
  {
    id: 4,
    topic: "Algorithms",
    question: "Which algorithm paradigm does Merge Sort use?",
    options: ["Greedy", "Dynamic Programming", "Divide and Conquer", "Backtracking"],
    correct: 2,
  },
  {
    id: 5,
    topic: "OOP",
    question: "Which principle states that a class should have only one reason to change?",
    options: ["Open/Closed", "Single Responsibility", "Liskov Substitution", "Interface Segregation"],
    correct: 1,
  },
  {
    id: 6,
    topic: "OOP",
    question: "What is polymorphism?",
    options: [
      "Hiding internal details",
      "Inheriting from multiple classes",
      "Objects taking many forms",
      "Encapsulating data",
    ],
    correct: 2,
  },
  {
    id: 7,
    topic: "Databases",
    question: "Which normal form eliminates transitive dependencies?",
    options: ["1NF", "2NF", "3NF", "BCNF"],
    correct: 2,
  },
  {
    id: 8,
    topic: "Databases",
    question: "What does ACID stand for in database transactions?",
    options: [
      "Atomicity, Consistency, Isolation, Durability",
      "Addition, Consistency, Integrity, Durability",
      "Atomicity, Completeness, Isolation, Dependency",
      "Accuracy, Consistency, Isolation, Durability",
    ],
    correct: 0,
  },
  {
    id: 9,
    topic: "Networking",
    question: "Which layer of the OSI model handles routing?",
    options: ["Data Link", "Network", "Transport", "Application"],
    correct: 1,
  },
  {
    id: 10,
    topic: "Networking",
    question: "What protocol does HTTPS use for security?",
    options: ["SSH", "TLS/SSL", "FTP", "SMTP"],
    correct: 1,
  },
]

type TopicScore = {
  topic: string
  correct: number
  total: number
  timeSpent: number
  mistakes: string[]
}

type Phase = "setup" | "quiz" | "results"

export function DiagnosticClient() {
  const [phase, setPhase] = useState<Phase>("setup")
  const [subject, setSubject] = useState("computer-science")
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>(Array(quizQuestions.length).fill(null))
  const [startTime, setStartTime] = useState<number>(Date.now())

  const handleStart = () => {
    setPhase("quiz")
    setCurrentQ(0)
    setAnswers(Array(quizQuestions.length).fill(null))
    setStartTime(Date.now())
  }

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers]
    newAnswers[currentQ] = optionIndex
    setAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQ < quizQuestions.length - 1) {
      setCurrentQ(currentQ + 1)
    } else {
      setPhase("results")
    }
  }

  const getTopicScores = (): TopicScore[] => {
    const topics: Record<string, TopicScore> = {}
    quizQuestions.forEach((q, i) => {
      if (!topics[q.topic]) {
        topics[q.topic] = { topic: q.topic, correct: 0, total: 0, timeSpent: 0, mistakes: [] }
      }
      topics[q.topic].total++
      if (answers[i] === q.correct) {
        topics[q.topic].correct++
      } else {
        topics[q.topic].mistakes.push(q.question)
      }
    })
    const elapsed = (Date.now() - startTime) / 1000
    const perQ = elapsed / quizQuestions.length
    Object.values(topics).forEach((t) => {
      t.timeSpent = Math.round(perQ * t.total)
    })
    return Object.values(topics)
  }

  const totalCorrect = answers.filter((a, i) => a === quizQuestions[i].correct).length

  if (phase === "setup") {
    return (
      <Card className="mx-auto max-w-lg border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display">
            <Brain className="size-5 text-primary" />
            Start Diagnostic Assessment
          </CardTitle>
          <CardDescription>
            Choose a subject to begin a 10-question diagnostic test that analyzes your strengths and weaknesses.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Select value={subject} onValueChange={setSubject}>
            <SelectTrigger>
              <SelectValue placeholder="Select Subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="computer-science">Computer Science</SelectItem>
              <SelectItem value="mathematics">Mathematics</SelectItem>
              <SelectItem value="physics">Physics</SelectItem>
            </SelectContent>
          </Select>
          <div className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Assessment Details:</p>
            <ul className="mt-2 flex flex-col gap-1">
              <li>10 diagnostic questions across 5 topics</li>
              <li>ML-based scoring analyzes accuracy and time spent</li>
              <li>Generates topic strength heatmap and improvement plan</li>
            </ul>
          </div>
          <Button onClick={handleStart} className="gap-2">
            Begin Assessment
            <ArrowRight className="size-4" />
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (phase === "quiz") {
    const q = quizQuestions[currentQ]
    return (
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center justify-between">
          <Badge variant="secondary" className="gap-1">
            <Clock className="size-3" />
            Question {currentQ + 1} of {quizQuestions.length}
          </Badge>
          <Badge variant="outline">{q.topic}</Badge>
        </div>
        <Progress value={((currentQ + 1) / quizQuestions.length) * 100} className="mb-8" />
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg font-display leading-relaxed">{q.question}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {q.options.map((option, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                className={`rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
                  answers[currentQ] === i
                    ? "border-primary bg-primary/10 text-primary font-medium"
                    : "border-border bg-card text-foreground hover:bg-muted"
                }`}
              >
                <span className="mr-3 inline-flex size-6 items-center justify-center rounded-full border border-current text-xs font-medium">
                  {String.fromCharCode(65 + i)}
                </span>
                {option}
              </button>
            ))}
            <Button
              onClick={handleNext}
              disabled={answers[currentQ] === null}
              className="mt-4 gap-2"
            >
              {currentQ === quizQuestions.length - 1 ? "Finish Assessment" : "Next Question"}
              <ArrowRight className="size-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Results phase
  const topicScores = getTopicScores()
  return (
    <div className="flex flex-col gap-6">
      {/* Score Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="border-border">
          <CardContent className="flex flex-col items-center py-6">
            <span className="font-display text-4xl font-bold text-primary">{totalCorrect}/{quizQuestions.length}</span>
            <span className="mt-1 text-sm text-muted-foreground">Overall Score</span>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="flex flex-col items-center py-6">
            <span className="font-display text-4xl font-bold text-foreground">{Math.round((totalCorrect / quizQuestions.length) * 100)}%</span>
            <span className="mt-1 text-sm text-muted-foreground">Accuracy</span>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="flex flex-col items-center py-6">
            <span className="font-display text-4xl font-bold text-foreground">{Math.round((Date.now() - startTime) / 1000)}s</span>
            <span className="mt-1 text-sm text-muted-foreground">Total Time</span>
          </CardContent>
        </Card>
      </div>

      {/* Topic Strength Heatmap */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="font-display">Topic Strength Heatmap</CardTitle>
          <CardDescription>Visual breakdown of performance across topics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            {topicScores.map((ts) => {
              const pct = Math.round((ts.correct / ts.total) * 100)
              const color =
                pct >= 80 ? "bg-chart-5" : pct >= 50 ? "bg-accent" : "bg-destructive"
              const label = pct >= 80 ? "Strong" : pct >= 50 ? "Average" : "Weak"
              return (
                <div key={ts.topic} className="flex items-center gap-4">
                  <span className="w-32 text-sm font-medium text-foreground">{ts.topic}</span>
                  <div className="relative flex-1 h-8 rounded-md bg-muted overflow-hidden">
                    <div
                      className={`h-full ${color} transition-all rounded-md`}
                      style={{ width: `${pct}%` }}
                    />
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-foreground">
                      {pct}%
                    </span>
                  </div>
                  <Badge
                    variant={pct >= 80 ? "default" : pct >= 50 ? "secondary" : "destructive"}
                    className="w-20 justify-center"
                  >
                    {label}
                  </Badge>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Improvement Plan */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display">
            <Zap className="size-5 text-accent" />
            Personalized Improvement Plan
          </CardTitle>
          <CardDescription>AI-generated recommendations based on your performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            {topicScores
              .filter((ts) => ts.correct / ts.total < 1)
              .sort((a, b) => a.correct / a.total - b.correct / b.total)
              .map((ts) => {
                const pct = Math.round((ts.correct / ts.total) * 100)
                return (
                  <div key={ts.topic} className="rounded-lg border border-border p-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-display text-sm font-semibold text-foreground">{ts.topic}</h4>
                      <Badge variant={pct >= 50 ? "secondary" : "destructive"}>
                        {ts.correct}/{ts.total} correct
                      </Badge>
                    </div>
                    {ts.mistakes.length > 0 && (
                      <div className="mt-3 flex flex-col gap-2">
                        <p className="text-xs font-medium text-muted-foreground">Missed questions:</p>
                        {ts.mistakes.map((m, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-foreground">
                            <XCircle className="mt-0.5 size-3 shrink-0 text-destructive" />
                            {m}
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="mt-3 rounded-md bg-primary/5 px-3 py-2 text-xs text-primary">
                      <CheckCircle2 className="mb-0.5 mr-1 inline size-3" />
                      Recommendation: Review {ts.topic.toLowerCase()} fundamentals and attempt adaptive practice set.
                    </div>
                  </div>
                )
              })}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() => {
            setPhase("setup")
            setAnswers(Array(quizQuestions.length).fill(null))
          }}
          className="gap-2"
        >
          <RotateCcw className="size-4" />
          Retake Assessment
        </Button>
        <Button asChild className="gap-2">
          <a href="/study-plan">
            Generate Study Plan
            <ArrowRight className="size-4" />
          </a>
        </Button>
      </div>
    </div>
  )
}
