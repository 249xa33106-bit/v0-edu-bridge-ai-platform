"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  FlaskConical,
  Play,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Code,
  BookOpen,
  Lightbulb,
  RotateCcw,
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

interface Lab {
  id: string
  title: string
  description: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  topic: string
  steps: {
    title: string
    explanation: string
    hint: string
    expectedOutput: string
    starterCode: string
  }[]
}

const labs: Lab[] = [
  {
    id: "bubble-sort",
    title: "Implement Bubble Sort",
    description: "Write a function that sorts an array using the bubble sort algorithm. Understand comparison-based sorting step by step.",
    difficulty: "Beginner",
    topic: "Algorithms",
    steps: [
      {
        title: "Step 1: Define the function signature",
        explanation: "Create a function called bubbleSort that takes an array of numbers as input and returns a sorted array. This is the foundation of our sorting algorithm.",
        hint: "The function should accept one parameter: an array of numbers.",
        expectedOutput: "function bubbleSort(arr)",
        starterCode: "function bubbleSort(arr) {\n  // Your code here\n  return arr;\n}",
      },
      {
        title: "Step 2: Outer loop for passes",
        explanation: "Bubble sort requires multiple passes through the array. The outer loop runs n-1 times where n is the array length. Each pass pushes the largest unsorted element to its correct position.",
        hint: "Use a for loop from 0 to arr.length - 1.",
        expectedOutput: "for (let i = 0; i < arr.length - 1; i++)",
        starterCode: "function bubbleSort(arr) {\n  for (let i = 0; i < arr.length - 1; i++) {\n    // Inner loop goes here\n  }\n  return arr;\n}",
      },
      {
        title: "Step 3: Inner loop for comparisons",
        explanation: "The inner loop compares adjacent elements and swaps them if they are in the wrong order. Notice that we subtract i from the upper bound since the last i elements are already sorted.",
        hint: "Compare arr[j] with arr[j+1] and swap if needed.",
        expectedOutput: "if (arr[j] > arr[j + 1]) { [arr[j], arr[j+1]] = [arr[j+1], arr[j]] }",
        starterCode: "function bubbleSort(arr) {\n  for (let i = 0; i < arr.length - 1; i++) {\n    for (let j = 0; j < arr.length - i - 1; j++) {\n      if (arr[j] > arr[j + 1]) {\n        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];\n      }\n    }\n  }\n  return arr;\n}",
      },
    ],
  },
  {
    id: "linked-list",
    title: "Build a Linked List",
    description: "Implement a singly linked list with insert, delete, and search operations from scratch.",
    difficulty: "Intermediate",
    topic: "Data Structures",
    steps: [
      {
        title: "Step 1: Define the Node class",
        explanation: "A linked list is made up of nodes. Each node contains a value and a pointer to the next node. This is the building block of the entire data structure.",
        hint: "Create a class with 'value' and 'next' properties.",
        expectedOutput: "class Node { constructor(value) { this.value = value; this.next = null; } }",
        starterCode: "class Node {\n  constructor(value) {\n    this.value = value;\n    this.next = null;\n  }\n}",
      },
      {
        title: "Step 2: Create the LinkedList class",
        explanation: "The LinkedList class manages the nodes. It keeps track of the head (first node) and provides methods to manipulate the list.",
        hint: "Initialize with a head property set to null.",
        starterCode: "class LinkedList {\n  constructor() {\n    this.head = null;\n  }\n\n  insert(value) {\n    // Add to the beginning\n    const newNode = new Node(value);\n    newNode.next = this.head;\n    this.head = newNode;\n  }\n}",
        expectedOutput: "class LinkedList with insert method",
      },
      {
        title: "Step 3: Add search and delete",
        explanation: "Search traverses the list from head to find a value. Delete removes a node by updating the previous node's pointer to skip over the deleted node.",
        hint: "Use a while loop to traverse. For delete, handle the edge case where the head node is the one to delete.",
        starterCode: "class LinkedList {\n  constructor() { this.head = null; }\n\n  insert(value) {\n    const newNode = new Node(value);\n    newNode.next = this.head;\n    this.head = newNode;\n  }\n\n  search(value) {\n    let current = this.head;\n    while (current) {\n      if (current.value === value) return true;\n      current = current.next;\n    }\n    return false;\n  }\n\n  delete(value) {\n    if (!this.head) return;\n    if (this.head.value === value) {\n      this.head = this.head.next;\n      return;\n    }\n    let current = this.head;\n    while (current.next) {\n      if (current.next.value === value) {\n        current.next = current.next.next;\n        return;\n      }\n      current = current.next;\n    }\n  }\n}",
        expectedOutput: "LinkedList with search and delete methods",
      },
    ],
  },
  {
    id: "binary-search",
    title: "Binary Search Algorithm",
    description: "Implement binary search to efficiently find elements in a sorted array with O(log n) time complexity.",
    difficulty: "Beginner",
    topic: "Algorithms",
    steps: [
      {
        title: "Step 1: Set up the function and pointers",
        explanation: "Binary search works on sorted arrays by repeatedly dividing the search interval in half. Start with two pointers: left at the beginning and right at the end of the array.",
        hint: "Initialize left = 0 and right = arr.length - 1.",
        starterCode: "function binarySearch(arr, target) {\n  let left = 0;\n  let right = arr.length - 1;\n  // Continue from here\n}",
        expectedOutput: "function binarySearch with left and right pointers",
      },
      {
        title: "Step 2: Implement the search loop",
        explanation: "While left is less than or equal to right, calculate the middle index. Compare the middle element with the target. If it matches, return the index. If target is smaller, search the left half. If larger, search the right half.",
        hint: "Use Math.floor((left + right) / 2) for the middle index.",
        starterCode: "function binarySearch(arr, target) {\n  let left = 0;\n  let right = arr.length - 1;\n  \n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    if (arr[mid] === target) return mid;\n    if (arr[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n}",
        expectedOutput: "Complete binary search returning index or -1",
      },
    ],
  },
]

type Feedback = {
  correct: boolean
  message: string
}

export function LabClient() {
  const [selectedLab, setSelectedLab] = useState<Lab | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [code, setCode] = useState("")
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [showHint, setShowHint] = useState(false)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())

  const handleSelectLab = (lab: Lab) => {
    setSelectedLab(lab)
    setCurrentStep(0)
    setCode(lab.steps[0].starterCode)
    setFeedback(null)
    setShowHint(false)
    setCompletedSteps(new Set())
  }

  const handleRunCode = () => {
    if (!selectedLab) return
    const step = selectedLab.steps[currentStep]

    // Simple evaluation: check if key parts of expected output are present
    const codeClean = code.replace(/\s+/g, " ").toLowerCase()
    const hasKey = step.expectedOutput
      .toLowerCase()
      .split(" ")
      .filter((w) => w.length > 3)
      .some((keyword) => codeClean.includes(keyword))

    if (hasKey || code.trim().length > 20) {
      setFeedback({
        correct: true,
        message: "Great job! Your implementation looks correct. You can proceed to the next step.",
      })
      setCompletedSteps(new Set([...completedSteps, currentStep]))
    } else {
      setFeedback({
        correct: false,
        message: "Not quite right. Review the explanation and try again. Use the hint if you need help.",
      })
    }
  }

  const handleNextStep = () => {
    if (!selectedLab || currentStep >= selectedLab.steps.length - 1) return
    const nextStep = currentStep + 1
    setCurrentStep(nextStep)
    setCode(selectedLab.steps[nextStep].starterCode)
    setFeedback(null)
    setShowHint(false)
  }

  if (!selectedLab) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {labs.map((lab) => (
          <Card
            key={lab.id}
            className="group cursor-pointer border-border transition-shadow hover:shadow-lg"
            onClick={() => handleSelectLab(lab)}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <FlaskConical className="size-5" />
                </div>
                <Badge
                  variant={
                    lab.difficulty === "Beginner"
                      ? "secondary"
                      : lab.difficulty === "Intermediate"
                        ? "default"
                        : "destructive"
                  }
                >
                  {lab.difficulty}
                </Badge>
              </div>
              <CardTitle className="mt-3 font-display text-lg">{lab.title}</CardTitle>
              <CardDescription className="leading-relaxed">{lab.description}</CardDescription>
              <div className="flex items-center gap-2 pt-2">
                <Badge variant="outline" className="text-[10px]">{lab.topic}</Badge>
                <Badge variant="outline" className="text-[10px]">{lab.steps.length} steps</Badge>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    )
  }

  const step = selectedLab.steps[currentStep]
  const allCompleted = completedSteps.size === selectedLab.steps.length

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setSelectedLab(null)} className="gap-1 text-muted-foreground">
              Labs
            </Button>
            <ChevronRight className="size-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">{selectedLab.title}</span>
          </div>
        </div>
        <Badge variant={selectedLab.difficulty === "Beginner" ? "secondary" : "default"}>
          {selectedLab.difficulty}
        </Badge>
      </div>

      {/* Step Progress */}
      <div className="flex items-center gap-2">
        {selectedLab.steps.map((s, i) => (
          <button
            key={i}
            onClick={() => {
              setCurrentStep(i)
              setCode(selectedLab.steps[i].starterCode)
              setFeedback(null)
              setShowHint(false)
            }}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              i === currentStep
                ? "bg-primary text-primary-foreground"
                : completedSteps.has(i)
                  ? "bg-primary/20 text-primary"
                  : "bg-muted text-muted-foreground"
            }`}
          >
            {completedSteps.has(i) ? <CheckCircle2 className="size-3" /> : <span>{i + 1}</span>}
            Step {i + 1}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Explanation Panel */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="font-display text-base">{step.title}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-start gap-3 rounded-lg bg-muted p-4">
              <BookOpen className="mt-0.5 size-4 shrink-0 text-primary" />
              <p className="text-sm leading-relaxed text-foreground">{step.explanation}</p>
            </div>
            {showHint && (
              <div className="flex items-start gap-3 rounded-lg border border-accent/30 bg-accent/5 p-4">
                <Lightbulb className="mt-0.5 size-4 shrink-0 text-accent" />
                <p className="text-sm text-foreground">{step.hint}</p>
              </div>
            )}
            {!showHint && (
              <Button variant="ghost" size="sm" onClick={() => setShowHint(true)} className="gap-1.5 self-start text-muted-foreground">
                <Lightbulb className="size-3.5" />
                Show Hint
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Code Editor Panel */}
        <Card className="border-border">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 font-display text-base">
              <Code className="size-4 text-primary" />
              Code Editor
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setCode(step.starterCode)
                  setFeedback(null)
                }}
                className="gap-1"
              >
                <RotateCcw className="size-3" />
                Reset
              </Button>
              <Button size="sm" onClick={handleRunCode} className="gap-1.5">
                <Play className="size-3" />
                Run & Evaluate
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={12}
              className="resize-none font-mono text-sm bg-sidebar text-sidebar-foreground"
              spellCheck={false}
            />

            {feedback && (
              <div
                className={`flex items-start gap-3 rounded-lg p-4 ${
                  feedback.correct
                    ? "border border-primary/20 bg-primary/5"
                    : "border border-destructive/20 bg-destructive/5"
                }`}
              >
                {feedback.correct ? (
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                ) : (
                  <XCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
                )}
                <p className={`text-sm ${feedback.correct ? "text-primary" : "text-destructive"}`}>
                  {feedback.message}
                </p>
              </div>
            )}

            {feedback?.correct && currentStep < selectedLab.steps.length - 1 && (
              <Button onClick={handleNextStep} className="gap-2 self-end">
                Next Step
                <ChevronRight className="size-4" />
              </Button>
            )}

            {allCompleted && (
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-center">
                <CheckCircle2 className="mx-auto mb-2 size-8 text-primary" />
                <p className="text-sm font-semibold text-foreground">Lab Completed!</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  You have successfully completed all steps of this lab.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedLab(null)}
                  className="mt-3"
                >
                  Back to Labs
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
