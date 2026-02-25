"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
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
import {
  Upload,
  Languages,
  Volume2,
  Mic,
  Send,
  FileText,
  Sparkles,
  BookOpen,
  Bot,
  User,
  MessageSquare,
  Loader2,
} from "lucide-react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import type { UIMessage } from "ai"

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] } },
}

const glassCard = "rounded-2xl border border-white/[0.12] bg-white/[0.06] shadow-lg shadow-black/[0.04] backdrop-blur-xl"

const sampleNotes = `Machine Learning is a subset of Artificial Intelligence that enables systems to learn from data, identify patterns, and make decisions with minimal human intervention. 

Supervised learning uses labeled data to train models. For example, predicting house prices based on features like size, location, and number of rooms. Common algorithms include Linear Regression, Decision Trees, and Support Vector Machines.

Unsupervised learning finds hidden patterns in unlabeled data. K-Means Clustering groups similar data points together, while Principal Component Analysis reduces data dimensions.`

const translations: Record<string, { simplified: string; translated: string }> = {
  telugu: {
    simplified:
      "Machine Learning is like teaching a computer to learn from examples. Instead of telling it exactly what to do, we show it many examples and it learns the patterns itself.",
    translated:
      "మెషిన్ లర్నింగ్ అనేది కంప్యూటర్‌కు ఉదాహరణల నుండి నేర్చుకోవడం నేర్పించడం లాంటిది. ఏమి చేయాలో ఖచ్చితంగా చెప్పడం కాకుండా, మనం దానికి చాలా ఉదాహరణలు చూపిస్తాము మరియు అది నమూనాలను తనంతట తానుగా నేర్చుకుంటుంది.",
  },
  hindi: {
    simplified:
      "Machine Learning is like teaching a computer to learn from examples. Instead of telling it exactly what to do, we show it many examples and it learns the patterns itself.",
    translated:
      "मशीन लर्निंग कंप्यूटर को उदाहरणों से सीखना सिखाने जैसा है। इसे बिल्कुल बताने के बजाय कि क्या करना है, हम इसे कई उदाहरण दिखाते हैं और यह खुद पैटर्न सीख लेता है।",
  },
  tamil: {
    simplified:
      "Machine Learning is like teaching a computer to learn from examples. Instead of telling it exactly what to do, we show it many examples and it learns the patterns itself.",
    translated:
      "மெஷின் லர்னிங் என்பது ஒரு கணினிக்கு எடுத்துக்காட்டுகளிலிருந்து கற்றுக்கொள்ள கற்பிப்பது போன்றது. என்ன செய்ய வேண்டும் என்று சொல்வதற்கு பதிலாக, நாம் பல எடுத்துக்காட்டுகளைக் காட்டுகிறோம், அது தானாகவே வடிவங்களைக் கற்றுக்கொள்கிறது.",
  },
  kannada: {
    simplified:
      "Machine Learning is like teaching a computer to learn from examples. Instead of telling it exactly what to do, we show it many examples and it learns the patterns itself.",
    translated:
      "ಮೆಷಿನ್ ಲರ್ನಿಂಗ್ ಎಂದರೆ ಕಂಪ್ಯೂಟರ್‌ಗೆ ಉದಾಹರಣೆಗಳಿಂದ ಕಲಿಯಲು ಕಲಿಸುವಂತಿದೆ. ಏನು ಮಾಡಬೇಕೆಂದು ನಿಖರವಾಗಿ ಹೇಳುವ ಬದಲು, ನಾವು ಅನೇಕ ಉದಾಹರಣೆಗಳನ್ನು ತೋರಿಸುತ್ತೇವೆ ಮತ್ತು ಅದು ಮಾದರಿಗಳನ್ನು ತಾನಾಗಿಯೇ ಕಲಿಯುತ್ತದೆ.",
  },
}

const suggestedQuestions = [
  "Summarize the key concepts",
  "Explain this in simpler terms",
  "Quiz me on this material",
  "What are the main differences between the topics?",
]

function getMessageText(message: UIMessage): string {
  if (!message.parts || !Array.isArray(message.parts)) return ""
  return message.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("")
}

export function LearnClient() {
  const [notes, setNotes] = useState(sampleNotes)
  const [language, setLanguage] = useState("hindi")
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<{ simplified: string; translated: string } | null>(null)
  const [chatInput, setChatInput] = useState("")
  const chatScrollRef = useRef<HTMLDivElement>(null)

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/tutor-chat",
      prepareSendMessagesRequest: ({ id, messages }) => ({
        body: {
          id,
          messages,
          context: notes,
        },
      }),
    }),
  })

  const isStreaming = status === "streaming" || status === "submitted"

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight
    }
  }, [messages, status])

  const handleSendMessage = (text?: string) => {
    const messageText = text || chatInput
    if (!messageText.trim()) return
    sendMessage({ text: messageText })
    if (!text) setChatInput("")
  }

  const handleProcess = () => {
    if (!notes.trim()) return
    setIsProcessing(true)
    setTimeout(() => {
      setResult(translations[language] || translations.hindi)
      setIsProcessing(false)
    }, 1500)
  }

  const handleSpeak = (text: string) => {
    if ("speechSynthesis" in window) {
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
            <CardDescription>Paste your notes or upload study material</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={10}
              placeholder="Paste your notes here..."
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
                <Sparkles className="size-4" />
                {isProcessing ? "Processing..." : "Process"}
              </Button>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <FileText className="size-3" />
              Supports PDF, text, and pasted notes
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Right: Output Panel */}
      <motion.div variants={fadeUp} className="flex flex-col gap-6 lg:col-span-3">
        {result ? (
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
                  <p className="text-sm leading-relaxed text-foreground">{result.simplified}</p>
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
                  <p className="text-sm leading-relaxed text-foreground">{result.translated}</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          <Card className="flex flex-1 flex-col items-center justify-center border-dashed border-white/[0.12] bg-white/[0.04] backdrop-blur-xl py-16">
            <Languages className="mb-4 size-12 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">Process your notes to see simplified and translated output</p>
          </Card>
        )}

        {/* AI Chatbot Section */}
        <Card className={glassCard}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display text-base">
              <MessageSquare className="size-4 text-primary" />
              AI Study Assistant
            </CardTitle>
            <CardDescription>Ask questions about your study material and get AI-powered explanations</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {/* Chat messages area */}
            <div
              ref={chatScrollRef}
              className="flex max-h-80 min-h-[200px] flex-col gap-4 overflow-y-auto rounded-lg border border-white/[0.08] bg-white/[0.02] p-3 scroll-smooth"
            >
              {messages.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-4 py-8">
                  <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
                    <Bot className="size-6 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">Ask me anything about your notes</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      I can explain concepts, quiz you, or break down complex topics
                    </p>
                  </div>
                  {/* Suggested questions */}
                  <div className="flex flex-wrap justify-center gap-2">
                    {suggestedQuestions.map((q) => (
                      <button
                        key={q}
                        onClick={() => handleSendMessage(q)}
                        className="rounded-full border border-white/[0.12] bg-white/[0.06] px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-white/[0.1] hover:text-foreground"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((message) => {
                    const text = getMessageText(message)
                    if (!text) return null
                    const isUser = message.role === "user"
                    return (
                      <div key={message.id} className={`flex gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
                        <div
                          className={`flex size-7 shrink-0 items-center justify-center rounded-full ${
                            isUser ? "bg-primary" : "bg-primary/10"
                          }`}
                        >
                          {isUser ? (
                            <User className="size-3.5 text-primary-foreground" />
                          ) : (
                            <Bot className="size-3.5 text-primary" />
                          )}
                        </div>
                        <div
                          className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                            isUser
                              ? "rounded-tr-sm bg-primary text-primary-foreground"
                              : "rounded-tl-sm bg-muted text-foreground"
                          }`}
                        >
                          {text}
                        </div>
                      </div>
                    )
                  })}
                  {/* Streaming indicator */}
                  {isStreaming && !getMessageText(messages[messages.length - 1]) && (
                    <div className="flex gap-2.5">
                      <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <Bot className="size-3.5 text-primary" />
                      </div>
                      <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm bg-muted px-3.5 py-2.5">
                        <div className="flex gap-1">
                          <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:0ms]" />
                          <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:150ms]" />
                          <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:300ms]" />
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Input area */}
            <div className="flex items-end gap-2">
              <Textarea
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder={notes.trim() ? "Ask about your study material..." : "Paste study material first, then ask questions..."}
                rows={1}
                className="min-h-10 resize-none text-sm"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
              />
              <Button
                size="icon"
                onClick={() => handleSendMessage()}
                disabled={!chatInput.trim() || isStreaming}
                aria-label="Send question"
                className="shrink-0"
              >
                {isStreaming ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
