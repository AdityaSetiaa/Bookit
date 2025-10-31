import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { code, subtotal } = await req.json();

    const promoCodes: any = {
      "SAVE10": { type: "percentage", value: 10 },
      "FLAT50": { type: "flat", value: 50 },
      "FLAT100": { type: "flat", value: 100 }
    };

    const promo = promoCodes[code.toUpperCase()];

    if (!promo) {
      return NextResponse.json({ 
        valid: false, 
        message: "Invalid promo code" 
      });
    }

    const discount = promo.type === "percentage" 
      ? Math.round((subtotal * promo.value) / 100)
      : promo.value;

    return NextResponse.json({
      valid: true,
      discount,
      
    });

  } catch (error) {
    console.error("Promo validation error:", error);
    return NextResponse.json({ 
      valid: false, 
      message: "Error validating promo code" 
    });
  }
}