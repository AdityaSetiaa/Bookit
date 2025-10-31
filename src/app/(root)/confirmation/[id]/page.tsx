"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

export default function ConfirmationPage() {
  const { id } = useParams();
  const router = useRouter();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchBooking = async () => {
    try {
      const res = await fetch(`/api/bookings/${id}`);
      const data = await res.json();
      if (data.success) {
        setBooking(data.data);
      } else {
        console.error("Booking not found");
      }
    } catch (err) {
      console.error("Error fetching booking:", err);
    } finally {
      setLoading(false);
    }
  };

  if (id) fetchBooking();
}, [id]);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin h-8 w-8 border-4 border-yellow-400 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <p className="text-gray-600 mb-4">Booking not found.</p>
        <button
          onClick={() => router.push("/")}
          className="px-6 py-3 bg-yellow-400 text-black rounded-md hover:bg-yellow-500 transition"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center px-4">
      {/* Success Icon */}
      <div className="bg-green-500 rounded-full p-4 mb-4">
        <CheckCircle2 className="w-10 h-10 text-white" />
      </div>

      {/* Text */}
      <h1 className="text-2xl md:text-3xl font-semibold mb-2">
        Booking Confirmed
      </h1>
      <p className="text-gray-600 mb-6">
        Ref ID: <span className="font-medium">{booking.referenceId}</span>
      </p>

      {/* Button */}
      <button
        onClick={() => router.push("/")}
        className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
      >
        Back to Home
      </button>
    </div>
  );
}
