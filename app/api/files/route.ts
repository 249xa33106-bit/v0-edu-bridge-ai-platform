import { NextRequest, NextResponse } from "next/server"
import { del } from "@vercel/blob"
import { connectToDatabase } from "@/lib/mongodb"
import { FileModel } from "@/lib/models/file"

// GET /api/files?userId=xxx
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId")
    if (!userId) {
      return NextResponse.json({ error: "userId is required." }, { status: 400 })
    }

    await connectToDatabase()
    const files = await FileModel.find({ userId })
      .sort({ uploadedAt: -1 })
      .lean()

    const formatted = files.map((f) => ({
      id: String(f._id),
      fileName: f.fileName,
      fileType: f.fileType,
      fileSize: f.fileSize,
      blobUrl: f.blobUrl,
      subject: f.subject,
      description: f.description,
      uploadedAt: f.uploadedAt,
    }))

    return NextResponse.json({ files: formatted })
  } catch (error) {
    console.error("List files error:", error)
    return NextResponse.json({ error: "Failed to fetch files." }, { status: 500 })
  }
}

// DELETE /api/files?id=xxx
export async function DELETE(request: NextRequest) {
  try {
    const fileId = request.nextUrl.searchParams.get("id")
    if (!fileId) {
      return NextResponse.json({ error: "File id is required." }, { status: 400 })
    }

    await connectToDatabase()
    const file = await FileModel.findById(fileId)
    if (!file) {
      return NextResponse.json({ error: "File not found." }, { status: 404 })
    }

    // Delete from Vercel Blob
    try {
      await del(file.blobUrl)
    } catch {
      // Blob may already be deleted, continue with DB cleanup
    }

    // Delete from MongoDB
    await FileModel.findByIdAndDelete(fileId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete file error:", error)
    return NextResponse.json({ error: "Failed to delete file." }, { status: 500 })
  }
}
