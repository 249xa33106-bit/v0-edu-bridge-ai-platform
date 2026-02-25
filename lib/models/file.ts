import mongoose, { Schema, type Document } from "mongoose"

export interface IFile extends Document {
  userId: string
  fileName: string
  fileType: string
  fileSize: number
  blobUrl: string
  subject: string
  description: string
  uploadedAt: Date
}

const FileSchema = new Schema<IFile>({
  userId: { type: String, required: true, index: true },
  fileName: { type: String, required: true },
  fileType: { type: String, required: true },
  fileSize: { type: Number, required: true },
  blobUrl: { type: String, required: true },
  subject: { type: String, default: "" },
  description: { type: String, default: "" },
  uploadedAt: { type: Date, default: Date.now },
})

export const FileModel =
  mongoose.models.File || mongoose.model<IFile>("File", FileSchema)
