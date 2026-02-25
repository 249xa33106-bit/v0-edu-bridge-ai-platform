"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Upload,
  FileText,
  File,
  Trash2,
  Search,
  FolderOpen,
  AlertCircle,
  CheckCircle2,
  Loader2,
  X,
  Eye,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/components/auth/auth-provider"

interface StoredFile {
  id: string
  fileName: string
  fileType: string
  fileSize: number
  subject: string
  description: string
  uploadedAt: string
  /** data URL for small files (< 2 MB), null for larger */
  dataUrl: string | null
}

const STORAGE_KEY = "edubridge_materials"
const ALLOWED_EXTENSIONS = [".pdf", ".docx", ".doc", ".txt"]
const MAX_FILE_SIZE = 10 * 1024 * 1024
const DATA_URL_LIMIT = 2 * 1024 * 1024 // store data URL for files up to 2 MB

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function getFileIcon(type: string) {
  if (type === "application/pdf") return <FileText className="size-5 text-red-400" />
  if (type.includes("word")) return <FileText className="size-5 text-blue-400" />
  return <File className="size-5 text-purple-400" />
}

function loadFiles(userId: string): StoredFile[] {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}_${userId}`)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveFiles(userId: string, files: StoredFile[]) {
  try {
    localStorage.setItem(`${STORAGE_KEY}_${userId}`, JSON.stringify(files))
  } catch {
    // Storage might be full
  }
}

export function MaterialsClient() {
  const { user } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [files, setFiles] = useState<StoredFile[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [dragActive, setDragActive] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const [selectedFile, setSelectedFile] = useState<globalThis.File | null>(null)
  const [subject, setSubject] = useState("")
  const [description, setDescription] = useState("")

  const userId = user?.email || "anonymous"

  const fetchFiles = useCallback(() => {
    setLoading(true)
    setTimeout(() => {
      setFiles(loadFiles(userId))
      setLoading(false)
    }, 200)
  }, [userId])

  useEffect(() => {
    fetchFiles()
  }, [fetchFiles])

  useEffect(() => {
    if (success) {
      const t = setTimeout(() => setSuccess(null), 4000)
      return () => clearTimeout(t)
    }
  }, [success])

  useEffect(() => {
    if (error) {
      const t = setTimeout(() => setError(null), 5000)
      return () => clearTimeout(t)
    }
  }, [error])

  function validateFile(file: globalThis.File): string | null {
    const ext = "." + file.name.split(".").pop()?.toLowerCase()
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return "Only PDF, DOCX, DOC, and TXT files are allowed."
    }
    if (file.size > MAX_FILE_SIZE) {
      return "File size must be under 10 MB."
    }
    return null
  }

  function handleFileSelect(file: globalThis.File) {
    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      return
    }
    setSelectedFile(file)
    setError(null)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragActive(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileSelect(file)
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    setDragActive(true)
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault()
    setDragActive(false)
  }

  async function handleUpload() {
    if (!selectedFile) return

    setUploading(true)
    setUploadProgress(0)
    setError(null)

    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 15
      })
    }, 150)

    try {
      let dataUrl: string | null = null

      // Read file as data URL for small files
      if (selectedFile.size <= DATA_URL_LIMIT) {
        dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = () => reject(new Error("Failed to read file"))
          reader.readAsDataURL(selectedFile)
        })
      }

      clearInterval(progressInterval)

      const newFile: StoredFile = {
        id: `file_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        fileName: selectedFile.name,
        fileType: selectedFile.type || "application/octet-stream",
        fileSize: selectedFile.size,
        subject,
        description,
        uploadedAt: new Date().toISOString(),
        dataUrl,
      }

      const updated = [newFile, ...files]
      setFiles(updated)
      saveFiles(userId, updated)

      setUploadProgress(100)
      setSuccess(`"${selectedFile.name}" saved successfully!`)
      setSelectedFile(null)
      setSubject("")
      setDescription("")
      if (fileInputRef.current) fileInputRef.current.value = ""
    } catch {
      clearInterval(progressInterval)
      setError("Failed to save the file. Storage may be full.")
    } finally {
      setUploading(false)
      setTimeout(() => setUploadProgress(0), 1500)
    }
  }

  function handleDelete(fileId: string) {
    setDeletingId(fileId)
    setTimeout(() => {
      const updated = files.filter((f) => f.id !== fileId)
      setFiles(updated)
      saveFiles(userId, updated)
      setSuccess("File deleted successfully.")
      setDeletingId(null)
    }, 300)
  }

  function handleView(file: StoredFile) {
    if (file.dataUrl) {
      const win = window.open()
      if (win) {
        win.document.write(
          `<iframe src="${file.dataUrl}" style="width:100%;height:100%;border:none;" title="${file.fileName}"></iframe>`
        )
      }
    } else {
      setError("Preview not available for files larger than 2 MB. Re-upload a smaller version to enable preview.")
    }
  }

  const filteredFiles = files.filter(
    (f) =>
      f.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.subject.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-8">
      {/* Notifications */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
          >
            <AlertCircle className="size-4 shrink-0" />
            <span className="flex-1">{error}</span>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300" aria-label="Dismiss error">
              <X className="size-4" />
            </button>
          </motion.div>
        )}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="flex items-center gap-3 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-300"
          >
            <CheckCircle2 className="size-4 shrink-0" />
            <span className="flex-1">{success}</span>
            <button onClick={() => setSuccess(null)} className="text-green-400 hover:text-green-300" aria-label="Dismiss success">
              <X className="size-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl glass-card p-6"
      >
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
          <Upload className="size-5 text-purple-400" />
          Upload Study Material
        </h2>

        {/* Drag and Drop Zone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click()
          }}
          aria-label="Drop zone for file upload"
          className={`relative cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all duration-300 ${
            dragActive
              ? "border-purple-400 bg-purple-500/10"
              : selectedFile
                ? "border-green-500/30 bg-green-500/5"
                : "border-border hover:border-purple-500/40 hover:bg-purple-500/5"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.doc,.txt"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleFileSelect(file)
            }}
          />

          {selectedFile ? (
            <div className="flex flex-col items-center gap-2">
              {getFileIcon(selectedFile.type)}
              <p className="font-medium text-foreground">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">{formatBytes(selectedFile.size)}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedFile(null)
                  if (fileInputRef.current) fileInputRef.current.value = ""
                }}
                className="mt-1 text-xs text-red-400 hover:text-red-300"
              >
                Remove
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="flex size-12 items-center justify-center rounded-full bg-purple-500/15">
                <Upload className="size-5 text-purple-400" />
              </div>
              <p className="font-medium text-foreground">
                Drag & drop a file here, or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                Accepted: PDF, DOCX, DOC, TXT (max 10 MB)
              </p>
            </div>
          )}
        </div>

        {/* Metadata fields */}
        {selectedFile && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-4 space-y-4"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="subject" className="text-sm text-foreground">
                  Subject / Topic
                </Label>
                <Input
                  id="subject"
                  placeholder="e.g., Linear Algebra, Data Structures"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="bg-background/50 border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm text-foreground">
                  Description (optional)
                </Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the material..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={1}
                  className="bg-background/50 border-border"
                />
              </div>
            </div>

            {uploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Saving...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}

            <Button
              onClick={handleUpload}
              disabled={uploading}
              className="w-full gap-2 bg-purple-600 text-white hover:bg-purple-500"
            >
              {uploading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Upload className="size-4" />
                  Upload Material
                </>
              )}
            </Button>
          </motion.div>
        )}
      </motion.div>

      {/* Files Dashboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="rounded-2xl glass-card p-6"
      >
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <FolderOpen className="size-5 text-purple-400" />
            My Materials
            <span className="ml-1 rounded-full bg-purple-500/15 px-2 py-0.5 text-xs font-normal text-purple-300">
              {files.length}
            </span>
          </h2>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-background/50 border-border pl-9"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="size-6 animate-spin text-purple-400" />
            <span className="ml-2 text-sm text-muted-foreground">Loading materials...</span>
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-purple-500/10 mb-3">
              <FolderOpen className="size-6 text-purple-400/60" />
            </div>
            <p className="font-medium text-foreground">
              {searchQuery ? "No files match your search." : "No materials uploaded yet."}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {searchQuery
                ? "Try a different search term."
                : "Upload your first study material above to get started."}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Table Header */}
            <div className="hidden sm:grid sm:grid-cols-12 gap-4 rounded-lg bg-purple-500/5 px-4 py-2.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <div className="col-span-5">File</div>
              <div className="col-span-2">Subject</div>
              <div className="col-span-1 text-right">Size</div>
              <div className="col-span-2 text-right">Uploaded</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            <AnimatePresence mode="popLayout">
              {filteredFiles.map((file, idx) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2, delay: idx * 0.03 }}
                  className="group rounded-xl border border-border/50 bg-background/30 px-4 py-3 transition-all duration-200 hover:border-purple-500/20 hover:bg-purple-500/5"
                >
                  {/* Mobile layout */}
                  <div className="flex flex-col gap-3 sm:hidden">
                    <div className="flex items-start gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-purple-500/10">
                        {getFileIcon(file.fileType)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate font-medium text-sm text-foreground">{file.fileName}</p>
                        {file.subject && (
                          <span className="mt-1 inline-block rounded-full bg-purple-500/10 px-2 py-0.5 text-xs text-purple-300">
                            {file.subject}
                          </span>
                        )}
                        <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{formatBytes(file.fileSize)}</span>
                          <span>{formatDate(file.uploadedAt)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleView(file)}
                        className="gap-1.5 text-xs hover:border-purple-500/30 hover:text-purple-300"
                      >
                        <Eye className="size-3" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(file.id)}
                        disabled={deletingId === file.id}
                        className="gap-1.5 text-xs text-red-400 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-300"
                      >
                        {deletingId === file.id ? (
                          <Loader2 className="size-3 animate-spin" />
                        ) : (
                          <Trash2 className="size-3" />
                        )}
                        Delete
                      </Button>
                    </div>
                  </div>

                  {/* Desktop layout */}
                  <div className="hidden sm:grid sm:grid-cols-12 sm:items-center gap-4">
                    <div className="col-span-5 flex items-center gap-3 min-w-0">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-purple-500/10">
                        {getFileIcon(file.fileType)}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">{file.fileName}</p>
                        {file.description && (
                          <p className="truncate text-xs text-muted-foreground">{file.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="col-span-2">
                      {file.subject ? (
                        <span className="inline-block rounded-full bg-purple-500/10 px-2 py-0.5 text-xs text-purple-300">
                          {file.subject}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">--</span>
                      )}
                    </div>
                    <div className="col-span-1 text-right text-xs text-muted-foreground">
                      {formatBytes(file.fileSize)}
                    </div>
                    <div className="col-span-2 text-right text-xs text-muted-foreground">
                      {formatDate(file.uploadedAt)}
                    </div>
                    <div className="col-span-2 flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleView(file)}
                        className="gap-1.5 text-xs hover:border-purple-500/30 hover:text-purple-300"
                      >
                        <Eye className="size-3" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(file.id)}
                        disabled={deletingId === file.id}
                        className="gap-1.5 text-xs text-red-400 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-300"
                      >
                        {deletingId === file.id ? (
                          <Loader2 className="size-3 animate-spin" />
                        ) : (
                          <Trash2 className="size-3" />
                        )}
                        Delete
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </div>
  )
}
