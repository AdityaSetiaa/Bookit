import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Experience from "@/Models/Experience";
import mongoose from "mongoose";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> } | { params: { id: string } }
) {
  try {
    const resolvedParams =
      "params" in context && typeof (context.params as any)?.then === "function"
        ? await (context.params as Promise<{ id: string }>)
        : (context.params as { id: string });

    const id = resolvedParams?.id;
    

    await connectDB();
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing experience ID in URL" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid experience ID format" },
        { status: 400 }
      );
    }

    const experience = await Experience.findById(id).lean();

    if (!experience) {
      return NextResponse.json(
        { success: false, error: "Experience not found" },
        { status: 404 }
      );
    }

    const slotAvailability =
      experience.timeSlots && experience.timeSlots.length > 0
        ? experience.timeSlots
        : [
            { date: "2025-11-01", available: true },
            { date: "2025-11-02", available: false },
            { date: "2025-11-03", available: true },
          ];

    return NextResponse.json({
      success: true,
      data: {
        ...experience,
        slots: slotAvailability,
      },
    });
  } catch (error) {
    console.error("Error fetching experience by ID:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch experience" },
      { status: 500 }
    );
  }
}
