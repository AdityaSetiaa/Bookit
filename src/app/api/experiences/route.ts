import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Experience from "@/Models/Experience";

export async function GET() {
  try {
    await connectDB();

    const experiences = await Experience.find();
    return NextResponse.json(experiences);
  } catch (error) {
    console.error("Error fetching experiences:", error);
    return NextResponse.json({ error: "Failed to fetch experiences" }, { status: 500 });
  }
}
