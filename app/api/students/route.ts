import { NextResponse } from "next/server"
import { connectToDatabase, isMongoConfigured } from "@/lib/mongodb"
import { StudentModel } from "@/lib/models/student"

export async function GET() {
  if (!isMongoConfigured()) {
    return NextResponse.json({ students: [], dbStatus: "not_configured" })
  }

  try {
    await connectToDatabase()

    const students = await StudentModel.find({})
      .sort({ lastActive: -1 })
      .lean()

    return NextResponse.json({ students, dbStatus: "connected" })
  } catch (error) {
    console.error("Error fetching students:", error)
    return NextResponse.json(
      { students: [], dbStatus: "error", error: "Failed to connect to database" },
      { status: 200 }
    )
  }
}
