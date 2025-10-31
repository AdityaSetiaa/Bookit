import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Experience from "@/Models/Experience";

export async function GET() {
  try {
    await connectDB();
    const experiences = await Experience.find({});
    
    if (!experiences) {
      return NextResponse.json({ error: "No experiences found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: experiences });
  } catch (error) {
    console.error("Error fetching experiences:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Failed to fetch experiences",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
