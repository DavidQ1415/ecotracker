import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// Get all surveys for the current user
export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const surveys = await prisma.survey.findMany({
      where: {
        userId: session.user.id as string
      },
      orderBy: {
        createdAt: "desc"
      },
      select: {
        id: true,
        footprintScore: true,
        createdAt: true,
      }
    })

    return NextResponse.json({ surveys })
  } catch (error) {
    console.error("Error fetching surveys:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// Create a new survey with just the footprint score
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { footprintScore } = body

    // Validate footprint score
    if (typeof footprintScore !== "number" || footprintScore < 0) {
      return NextResponse.json(
        { error: "Valid footprint score is required" },
        { status: 400 }
      )
    }

    // Create survey
    const survey = await prisma.survey.create({
      data: {
        userId: session.user.id as string,
        footprintScore,
      },
      select: {
        id: true,
        footprintScore: true,
        createdAt: true,
      }
    })

    return NextResponse.json(
      { message: "Survey saved successfully", survey },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error saving survey:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

