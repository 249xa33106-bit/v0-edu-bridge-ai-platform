import mongoose, { Schema, type Document } from "mongoose"

export interface IQuizResult {
  topicScores: { topic: string; correct: number; total: number }[]
  totalCorrect: number
  totalQuestions: number
  material: string
  subject: string
  timestamp: Date
}

export interface IStudent extends Document {
  userId: string
  name: string
  email: string
  quizResults: IQuizResult[]
  lastActive: Date
  createdAt: Date
}

const QuizResultSchema = new Schema<IQuizResult>(
  {
    topicScores: [
      {
        topic: { type: String, required: true },
        correct: { type: Number, required: true },
        total: { type: Number, required: true },
      },
    ],
    totalCorrect: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    material: { type: String, default: "" },
    subject: { type: String, default: "computer-science" },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
)

const StudentSchema = new Schema<IStudent>({
  userId: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  quizResults: { type: [QuizResultSchema], default: [] },
  lastActive: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
})

export const StudentModel =
  mongoose.models.Student || mongoose.model<IStudent>("Student", StudentSchema)
