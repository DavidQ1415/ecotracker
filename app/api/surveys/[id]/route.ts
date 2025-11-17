import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// Get a specific survey by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    const { id } = await params

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const survey = await prisma.survey.findFirst({
      where: {
        id,
        userId: session.user.id as string
      },
      select: {
        id: true,
        footprintScore: true,
        createdAt: true,
      }
    })

    if (!survey) {
      return NextResponse.json(
        { error: "Survey not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ survey })
  } catch (error) {
    console.error("Error fetching survey:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// Update a survey
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    const { id } = await params

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { footprintScore } = body

    // Check if survey exists and belongs to user
    const existingSurvey = await prisma.survey.findFirst({
      where: {
        id,
        userId: session.user.id as string
      }
    })

    if (!existingSurvey) {
      return NextResponse.json(
        { error: "Survey not found" },
        { status: 404 }
      )
    }

    // Validate footprint score
    if (typeof footprintScore !== "number" || footprintScore < 0) {
      return NextResponse.json(
        { error: "Valid footprint score is required" },
        { status: 400 }
      )
    }

    // Update survey
    const survey = await prisma.survey.update({
      where: { id },
      data: {
        footprintScore,
      },
      select: {
        id: true,
        footprintScore: true,
        createdAt: true,
      }
    })

    return NextResponse.json(
      { message: "Survey updated successfully", survey }
    )
  } catch (error) {
    console.error("Error updating survey:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// Delete a survey
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    const { id } = await params

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Check if survey exists and belongs to user
    const existingSurvey = await prisma.survey.findFirst({
      where: {
        id,
        userId: session.user.id as string
      }
    })

    if (!existingSurvey) {
      return NextResponse.json(
        { error: "Survey not found" },
        { status: 404 }
      )
    }

    await prisma.survey.delete({
      where: { id }
    })

    return NextResponse.json(
      { message: "Survey deleted successfully" }
    )
  } catch (error) {
    console.error("Error deleting survey:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

