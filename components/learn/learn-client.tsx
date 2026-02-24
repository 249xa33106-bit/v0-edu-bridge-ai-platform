"use client"

import { useState } from "react"
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
} from "lucide-react"

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

const qaExamples = [
  {
    q: "What is the difference between supervised and unsupervised learning?",
    a: "Supervised learning uses labeled data (we know the correct answers) to train models, while unsupervised learning works with unlabeled data to find hidden patterns. Think of supervised learning as learning with a teacher who gives you the answers, and unsupervised learning as exploring data on your own to find groups or patterns.",
  },
  {
    q: "Give me an example of supervised learning.",
    a: "A common example is predicting house prices. You give the model data about houses (size, location, rooms) along with their actual prices. The model learns the relationship and can then predict prices for new houses it has not seen before.",
  },
]

export function LearnClient() {
  const [notes, setNotes] = useState(sampleNotes)
  const [language, setLanguage] = useState("hindi")
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<{ simplified: string; translated: string } | null>(null)
  const [question, setQuestion] = useState("")
  const [chatHistory, setChatHistory] = useState<{ role: "user" | "assistant"; content: string }[]>([])

  const handleProcess = () => {
    if (!notes.trim()) return
    setIsProcessing(true)
    setTimeout(() => {
      setResult(translations[language] || translations.hindi)
      setIsProcessing(false)
    }, 1500)
  }

  const handleAsk = () => {
    if (!question.trim()) return
    const newHistory = [...chatHistory, { role: "user" as const, content: question }]
    const match = qaExamples.find(
      (qa) => question.toLowerCase().includes("supervised") || question.toLowerCase().includes("example")
    )
    const answer =
      match?.a ||
      "Based on your uploaded material, Machine Learning enables systems to learn from data automatically. The key distinction is between supervised learning (with labeled data) and unsupervised learning (finding hidden patterns). Would you like me to explain any specific concept in more detail?"
    newHistory.push({ role: "assistant", content: answer })
    setChatHistory(newHistory)
    setQuestion("")
  }

  const handleSpeak = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      window.speechSynthesis.speak(utterance)
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
      {/* Left: Input Panel */}
      <div className="lg:col-span-2">
        <Card className="border-border">
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
      </div>

      {/* Right: Output Panel */}
      <div className="flex flex-col gap-6 lg:col-span-3">
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
              <Card className="border-border">
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
              <Card className="border-border">
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
          <Card className="flex flex-1 flex-col items-center justify-center border-dashed border-border py-16">
            <Languages className="mb-4 size-12 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">Process your notes to see simplified and translated output</p>
          </Card>
        )}

        {/* Q&A Section */}
        <Card className="border-border">
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
                  Ask a question about the uploaded material
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
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask about the material..."
                rows={1}
                className="min-h-10 resize-none text-sm"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleAsk()
                  }
                }}
              />
              <Button size="icon" onClick={handleAsk} disabled={!question.trim()} aria-label="Send question">
                <Send className="size-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
