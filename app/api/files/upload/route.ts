import { NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { connectToDatabase, isMongoConfigured } from "@/lib/mongodb"
import { FileModel } from "@/lib/models/file"

const ALLOWED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "application/msword",
]
const MAX_SIZE = 10 * 1024 * 1024 // 10 MB

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const userId = formData.get("userId") as string | null
    const subject = (formData.get("subject") as string) || ""
    const description = (formData.get("description") as string) || ""

    if (!file || !userId) {
      return NextResponse.json(
        { error: "File and userId are required." },
        { status: 400 }
      )
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Only PDF, DOCX, DOC, and TXT files are allowed." },
        { status: 400 }
      )
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File size must be under 10 MB." },
        { status: 400 }
      )
    }

    if (!isMongoConfigured()) {
      return NextResponse.json(
        { error: "Database is not configured. Please add MONGODB_URI to environment variables." },
        { status: 503 }
      )
    }

    // Upload to Vercel Blob
    const blob = await put(`materials/${userId}/${Date.now()}-${file.name}`, file, {
      access: "public",
    })

    // Save metadata to MongoDB
    await connectToDatabase()
    const doc = await FileModel.create({
      userId,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      blobUrl: blob.url,
      subject,
      description,
      uploadedAt: new Date(),
    })

    return NextResponse.json({
      success: true,
      file: {
        id: doc._id,
        fileName: doc.fileName,
        fileType: doc.fileType,
        fileSize: doc.fileSize,
        blobUrl: doc.blobUrl,
        subject: doc.subject,
        description: doc.description,
        uploadedAt: doc.uploadedAt,
      },
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      { error: "Failed to upload file." },
      { status: 500 }
    )
  }
}
