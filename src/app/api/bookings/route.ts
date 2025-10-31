import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Booking from "@/Models/Booking";
import PromoCode from "@/Models/PromoCode";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();

    const {
      experienceId,
      experienceTitle,
      experienceLocation,
      slotId,
      date,
      dateRaw,
      timeSlot,
      userName,
      userEmail,
      numberOfPeople,
      subtotal,
      promoCode,
      discount = 0,
    } = data;

  let appliedDiscount = discount;
  let message = "Booking created successfully";
    if (promoCode) {
      const promo = await PromoCode.findOne({ code: promoCode.toUpperCase() });
      if (promo && typeof promo.validatePromo === "function") {
        const result = promo.validatePromo(subtotal);
        if (result?.valid) {
          appliedDiscount = result.discount;
          message = result.message;
        }
      }
    }

    
    const referenceId = `BK-${Date.now().toString(36).toUpperCase()}`;

    
    const booking = await Booking.create({
      referenceId,
      experienceId,
      experienceTitle,
      experienceLocation,
      slotId,
      date,
      dateRaw,
      timeSlot,
      userName,
      userEmail,
      numberOfPeople,
      subtotal,
      promoCode: promoCode?.toUpperCase(),
      discount: appliedDiscount,
      finalPrice: subtotal - appliedDiscount,
      bookingDate: new Date(),
      status: "confirmed",
    });

    return NextResponse.json({
      success: true,
      message,
      data: booking,
    });
  } catch (err: any) {
    console.error("❌ Booking creation failed:", err.message, err.stack);
    return NextResponse.json(
      {
        success: false,
        message: "Error creating booking",
        error: err.message,
      },
      { status: 500 }
    );
  }
}
