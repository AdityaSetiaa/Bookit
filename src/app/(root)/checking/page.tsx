"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";

interface BookingData {
  experienceId: string;
  experienceTitle: string;
  experienceLocation: string;
  date: string;
  dateRaw: string;
  timeSlot: string;
  numberOfPeople: number;
  subtotal: number;
  taxes: number;
  total: number;
}

export default function CheckoutPage() {
  const router = useRouter();

  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [userName, setUserName] = useState("John Doe");
  const [userEmail, setUserEmail] = useState("test@test.com");
  const [userPhone, setUserPhone] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedData = sessionStorage.getItem("bookingData");
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        setBookingData(parsed);
      } catch (error) {
        console.error("Error parsing booking data:", error);
      }
    }
  }, []);

  const handlePromoApply = async () => {
    if (!promoCode.trim()) {
      alert("Please enter a promo code");
      return;
    }

    try {
      const response = await fetch("/api/promo/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: promoCode.toUpperCase(),
          subtotal: bookingData?.subtotal || 0,
        }),
      });

      const data = await response.json();

      if (data.valid && data.discount) {
        setDiscount(data.discount);
        alert(data.message || "Promo code applied successfully!");
      } else {
        alert(data.message || "Invalid promo code");
        setDiscount(0);
      }
    } catch (error) {
      console.error("Error applying promo:", error);
      alert("Error applying promo code");
    }
  };

  const calculateFinalTotal = () => {
    if (!bookingData) return 0;
    return Math.max(0, bookingData.total - discount);
  };

  const handlePayAndConfirm = async () => {
    if (!userName.trim() || !userEmail.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    if (!agreedToTerms) {
      alert("Please agree to the terms and safety policy");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          experienceId: bookingData?.experienceId,
          experienceTitle: bookingData?.experienceTitle,
          experienceLocation: bookingData?.experienceLocation,
          slotId: null,
          date: bookingData?.date,
          dateRaw: bookingData?.dateRaw,
          timeSlot: bookingData?.timeSlot,
          userName,
          userEmail,
          userPhone,
          numberOfPeople: bookingData?.numberOfPeople,
          subtotal: bookingData?.subtotal,
          promoCode: promoCode?.toUpperCase() || undefined,
          discount,
          finalPrice: calculateFinalTotal(),
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok || !result) {
        throw new Error(result?.message || "Failed to create booking");
      }

      const booking = result.newBooking || result.data;

      if (booking && booking._id) {
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("bookingData");
        }
        router.push(`/confirmation/${booking._id}`);
      } else {
        alert(result.message || "Booking failed. Please try again.");
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("Error processing booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-yellow-400 mx-auto mb-4" />
          <p>Loading checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 mb-6 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Checkout
        </button>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Left: Form */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Checkout with Details</h2>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Full name
                  </label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-400"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-400"
                    placeholder="test@test.com"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm text-gray-600 mb-2">
                  Promo code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-400"
                    placeholder="Enter promo code"
                  />
                  <button
                    onClick={handlePromoApply}
                    className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
                  >
                    Apply
                  </button>
                </div>
              </div>

              <label className="flex items-start gap-3 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1"
                />
                I agree to the terms and safety policy
              </label>
            </div>
          </div>

          {/* Right: Summary */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Experience</span>
                  <span className="font-semibold text-right text-sm">
                    {bookingData.experienceTitle}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Date</span>
                  <span className="font-semibold">{bookingData.dateRaw}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Time</span>
                  <span className="font-semibold">{bookingData.timeSlot}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Qty</span>
                  <span className="font-semibold">
                    {bookingData.numberOfPeople}
                  </span>
                </div>
              </div>

              <div className="border-t pt-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">₹{bookingData.subtotal}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Taxes</span>
                  <span className="font-semibold">₹{bookingData.taxes}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between mb-2 text-green-600">
                    <span>Discount</span>
                    <span className="font-semibold">-₹{discount}</span>
                  </div>
                )}
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-2xl font-bold">
                    ₹{calculateFinalTotal()}
                  </span>
                </div>
              </div>

              <button
                onClick={handlePayAndConfirm}
                disabled={loading}
                className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-black font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Pay and Confirm"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
