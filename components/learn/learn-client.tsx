"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/components/auth/auth-provider"
import {
  Upload,
  Languages,
  Volume2,
  Send,
  FileText,
  Sparkles,
  BookOpen,
  FolderOpen,
  Check,
  Loader2,
  Mic,
  AlertCircle,
} from "lucide-react"

interface MaterialFile {
  id: string
  fileName: string
  fileType: string
  fileSize: number
  subject: string
  description: string
  uploadedAt: string
  dataUrl: string | null
}

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] } },
}

const glassCard = "rounded-2xl border border-white/[0.12] bg-white/[0.06] shadow-lg shadow-black/[0.04] backdrop-blur-xl"

const defaultNotes = ""

export function LearnClient() {
  const { user } = useAuth()
  const [notes, setNotes] = useState(defaultNotes)
  const [language, setLanguage] = useState("hindi")
  const [isProcessing, setIsProcessing] = useState(false)
  const [processError, setProcessError] = useState("")
  const [result, setResult] = useState<{ simplified: string; translated: string } | null>(null)
  const [question, setQuestion] = useState("")
  const [isAsking, setIsAsking] = useState(false)
  const [chatHistory, setChatHistory] = useState<{ role: "user" | "assistant"; content: string }[]>([])
  const [materials, setMaterials] = useState<MaterialFile[]>([])
  const [showMaterials, setShowMaterials] = useState(false)
  const [loadingMaterial, setLoadingMaterial] = useState<string | null>(null)

  // Load available materials from localStorage
  const materialsKey = user?.email || "anonymous"
  useEffect(() => {
    if (!user) return
    try {
      const raw = localStorage.getItem(`edubridge_materials_${materialsKey}`)
      if (raw) {
        const parsed: MaterialFile[] = JSON.parse(raw)
        setMaterials(parsed)
      }
    } catch {
      // silently fail
    }
  }, [user, materialsKey])

  const loadMaterial = (file: MaterialFile) => {
    setLoadingMaterial(file.id)

    if (file.dataUrl) {
      try {
        const base64Part = file.dataUrl.split(",")[1]
        if (base64Part) {
          const text = atob(base64Part)
          setNotes(text)
        }
      } catch {
        setNotes(`[Loaded material: ${file.fileName}]\n\nUnable to decode file content. Please paste the text manually.`)
      }
    } else {
      setNotes(`[Material: ${file.fileName}]\nSubject: ${file.subject}\n${file.description ? `Description: ${file.description}\n` : ""}\nThis file is too large to preview inline. Please paste the content manually.`)
    }

    // Clear previous results when loading new material
    setResult(null)
    setChatHistory([])
    setProcessError("")

    setTimeout(() => {
      setLoadingMaterial(null)
      setShowMaterials(false)
    }, 400)
  }

  const handleProcess = async () => {
    if (!notes.trim()) return
    setIsProcessing(true)
    setProcessError("")
    setResult(null)

    try {
      const res = await fetch("/api/tutor/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: notes.trim(), language }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Processing failed")
      setResult({ simplified: data.simplified, translated: data.translated })
    } catch (err) {
      setProcessError(err instanceof Error ? err.message : "Failed to process material. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleAsk = async () => {
    if (!question.trim() || isAsking) return
    const userQuestion = question.trim()
    setQuestion("")
    setIsAsking(true)

    const newHistory = [...chatHistory, { role: "user" as const, content: userQuestion }]
    setChatHistory(newHistory)

    try {
      const res = await fetch("/api/tutor/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: userQuestion,
          notes: notes.trim(),
          chatHistory: chatHistory.slice(-6),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to get answer")
      setChatHistory([...newHistory, { role: "assistant", content: data.answer }])
    } catch {
      setChatHistory([
        ...newHistory,
        { role: "assistant", content: "Sorry, I could not process your question right now. Please try again." },
      ])
    } finally {
      setIsAsking(false)
    }
  }

  const handleSpeak = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      window.speechSynthesis.speak(utterance)
    }
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={stagger}
      className="grid grid-cols-1 gap-6 lg:grid-cols-5"
    >
      {/* Left: Input Panel */}
      <motion.div variants={fadeUp} className="lg:col-span-2">
        <Card className={glassCard}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display">
              <Upload className="size-5 text-primary" />
              Input Material
            </CardTitle>
            <CardDescription>Paste your notes or load from your uploaded materials</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {/* Load from Materials button */}
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                className="w-full gap-2 border-dashed border-primary/30 text-muted-foreground hover:border-primary/60 hover:text-foreground"
                onClick={() => setShowMaterials(!showMaterials)}
              >
                <FolderOpen className="size-4" />
                {materials.length > 0
                  ? `Load from Materials (${materials.length})`
                  : "No materials uploaded yet"}
              </Button>

              <AnimatePresence>
                {showMaterials && materials.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 right-0 top-full z-20 mt-2 max-h-56 overflow-y-auto rounded-xl border border-white/[0.12] bg-card p-2 shadow-xl backdrop-blur-xl"
                  >
                    {materials.map((file) => (
                      <button
                        key={file.id}
                        onClick={() => loadMaterial(file)}
                        disabled={loadingMaterial === file.id}
                        className="group/mat flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all duration-200 hover:bg-purple-500/10"
                      >
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 transition-all duration-200 group-hover/mat:bg-purple-500/20 group-hover/mat:scale-110">
                          {loadingMaterial === file.id ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            <FileText className="size-4" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-foreground">
                            {file.fileName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {file.subject}
                            {file.description ? ` - ${file.description}` : ""}
                          </p>
                        </div>
                        {loadingMaterial === file.id ? (
                          <Check className="size-4 shrink-0 text-green-400" />
                        ) : (
                          <Badge variant="secondary" className="shrink-0 text-[10px]">
                            {file.fileType.replace(".", "").toUpperCase()}
                          </Badge>
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={10}
              placeholder="Paste your notes here or load from your materials above..."
              className="resize-none text-sm"
            />
            <div className="flex items-center gap-3">
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Target Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hindi">Hindi</SelectItem>
                  <SelectItem value="telugu">Telugu</SelectItem>
                  <SelectItem value="tamil">Tamil</SelectItem>
                  <SelectItem value="kannada">Kannada</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleProcess} disabled={isProcessing || !notes.trim()} className="gap-2">
                {isProcessing ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Sparkles className="size-4" />
                )}
                {isProcessing ? "Processing..." : "Process"}
              </Button>
            </div>

            {processError && (
              <div className="flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">
                <AlertCircle className="size-3.5 shrink-0" />
                {processError}
              </div>
            )}

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <FileText className="size-3" />
              Load content from Materials, then Process to simplify and translate
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Right: Output Panel */}
      <motion.div variants={fadeUp} className="flex flex-col gap-6 lg:col-span-3">
        {isProcessing ? (
          <Card className={`${glassCard} flex flex-1 flex-col items-center justify-center py-16`}>
            <Loader2 className="mb-4 size-10 animate-spin text-primary" />
            <p className="text-sm font-medium text-foreground">Analyzing your material...</p>
            <p className="mt-1 text-xs text-muted-foreground">Simplifying concepts and translating to {language}</p>
          </Card>
        ) : result ? (
          <Tabs defaultValue="simplified" className="w-full">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="simplified" className="gap-1.5">
                <BookOpen className="size-3.5" />
                Simplified
              </TabsTrigger>
              <TabsTrigger value="translated" className="gap-1.5">
                <Languages className="size-3.5" />
                Translated
              </TabsTrigger>
            </TabsList>
            <TabsContent value="simplified">
              <Card className={glassCard}>
                <CardHeader className="flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-display">Simplified Explanation</CardTitle>
                    <CardDescription>Complex concepts broken down into simple terms</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleSpeak(result.simplified)}
                    aria-label="Listen to simplified explanation"
                  >
                    <Volume2 className="size-4 text-primary" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">{result.simplified}</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="translated">
              <Card className={glassCard}>
                <CardHeader className="flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-display">
                      Regional Translation
                      <Badge variant="secondary" className="ml-2 capitalize">
                        {language}
                      </Badge>
                    </CardTitle>
                    <CardDescription>Content translated for native comprehension</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleSpeak(result.translated)}
                    aria-label="Listen to translated text"
                  >
                    <Volume2 className="size-4 text-primary" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">{result.translated}</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          <Card className="flex flex-1 flex-col items-center justify-center border-dashed border-white/[0.12] bg-white/[0.04] backdrop-blur-xl py-16">
            <Languages className="mb-4 size-12 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">Load material and press Process to see simplified and translated output</p>
          </Card>
        )}

        {/* Q&A Section */}
        <Card className={glassCard}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display text-base">
              <Mic className="size-4 text-primary" />
              Contextual Q&A
            </CardTitle>
            <CardDescription>Ask follow-up questions about your study material</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 max-h-60 overflow-y-auto">
              {chatHistory.length === 0 ? (
                <p className="text-center text-xs text-muted-foreground py-6">
                  {notes.trim()
                    ? "Ask a question about your loaded material"
                    : "Load or paste material first, then ask questions about it"}
                </p>
              ) : (
                <div className="flex flex-col gap-3">
                  {chatHistory.map((msg, i) => (
                    <div
                      key={i}
                      className={`rounded-lg px-3 py-2 text-sm ${
                        msg.role === "user"
                          ? "ml-auto max-w-[80%] bg-primary text-primary-foreground"
                          : "mr-auto max-w-[90%] bg-muted text-foreground"
                      }`}
                    >
                      {msg.content}
                    </div>
                  ))}
                  {isAsking && (
                    <div className="mr-auto flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
                      <Loader2 className="size-3.5 animate-spin" />
                      Thinking...
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder={notes.trim() ? "Ask about the material..." : "Load material first..."}
                rows={1}
                className="min-h-10 resize-none text-sm"
                disabled={!notes.trim() || isAsking}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleAsk()
                  }
                }}
              />
              <Button
                size="icon"
                onClick={handleAsk}
                disabled={!question.trim() || !notes.trim() || isAsking}
                aria-label="Send question"
              >
                {isAsking ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
