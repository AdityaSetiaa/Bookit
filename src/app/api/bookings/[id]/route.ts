import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Booking from "@/Models/Booking";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    await connectDB();
    const booking = await Booking.findById(id);

    if (!booking) {
      return NextResponse.json(
        { success: false, message: "Booking not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: booking });
  } catch (err: any) {
    console.error("Error fetching booking:", err.message);
    return NextResponse.json(
      { success: false, message: "Error fetching booking", error: err.message },
      { status: 500 }
    );
  }
}
