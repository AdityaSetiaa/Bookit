"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Calendar, Clock, ArrowLeft, Loader2 } from "lucide-react";

interface TimeSlot {
  date: string[];
  time: string[];
}

interface Experience {
  _id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  images: string;
  category: string;
  timeSlots?: TimeSlot[];
}

export default function BookingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const experienceId = params.id as string;

  const [experience, setExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchExperience();
  }, [experienceId]);

  const fetchExperience = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/experiences/${experienceId}`);
      const data = await response.json();
      
      if (data.success) {
        setExperience(data.data);
      } else {
        alert("Failed to load experience");
      }
    } catch (error) {
      console.error("Error fetching experience:", error);
      alert("Error loading experience");
    } finally {
      setLoading(false);
    }
  };

  const calculateSubtotal = () => {
    if (!experience) return 0;
    return experience.price * quantity;
  };

  const calculateTaxes = () => {
    return Math.round(calculateSubtotal() * 0.05);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTaxes();
  };

  const handleConfirm = () => {
  if (!selectedDate || !selectedTime) {
    alert("Please select date and time");
    return;
  }

  // Store booking data in sessionStorage
  const bookingData = {
    experienceId: experience?._id,
    experienceTitle: experience?.title,
    experienceLocation: experience?.location,
    date: `2025-10-${selectedDate}`,
    dateRaw: selectedDate,
    timeSlot: selectedTime,
    numberOfPeople: quantity,
    subtotal: calculateSubtotal(),
    taxes: calculateTaxes(),
    total: calculateTotal()
  };

  // Save to sessionStorage BEFORE navigating
  sessionStorage.setItem('bookingData', JSON.stringify(bookingData));

  // Navigate to checkout
  router.push('/checking');
};
   if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin h-8 w-8 border-4 border-yellow-400 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Experience not found</h2>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-2 bg-yellow-400 rounded-lg hover:bg-yellow-500"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const timeSlots = experience.timeSlots && experience.timeSlots.length > 0
    ? experience.timeSlots[0]
    : { date: [], time: [] };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
       

        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 mb-6 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Details
        </button>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Left: Experience Details */}
          <div className="md:col-span-2">
            <img
              src={experience.images}
              alt={experience.title}
              className="w-full h-64 object-cover rounded-lg mb-6"
            />

            <h1 className="text-3xl font-bold mb-2">{experience.title}</h1>
            <p className="text-gray-600 mb-6">{experience.description}</p>

            {/* Date Selection */}
            <div className="mb-8">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Choose date
              </h3>
              <div className="flex gap-2 flex-wrap">
                {timeSlots.date.map((date) => (
                  <button
                    key={date}
                    onClick={() => setSelectedDate(date)}
                    className={`px-6 py-3 rounded-lg border-2 transition ${
                      selectedDate === date
                        ? "bg-yellow-400 border-yellow-500 font-semibold"
                        : "bg-white border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    Oct {date}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Selection */}
            <div className="mb-8">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Choose time
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {timeSlots.time.map((time) => {
                  // Simulate unavailable slot
                  const isUnavailable = time === "1:00 pm";
                  return (
                    <button
                      key={time}
                      disabled={isUnavailable}
                      onClick={() => setSelectedTime(time)}
                      className={`px-4 py-3 rounded-lg border-2 transition text-sm ${
                        isUnavailable
                          ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                          : selectedTime === time
                          ? "bg-yellow-400 border-yellow-500 font-semibold"
                          : "bg-white border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {time} {isUnavailable && "- Full"}
                    </button>
                  );
                })}
              </div>
              <p className="text-sm text-gray-500 mt-3">
                All times are in IST (GMT +5:30)
              </p>
            </div>

            {/* About */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">About</h4>
              <p className="text-sm text-gray-600">
                Scenic routes, trained guides, and safety briefing. Minimum age 12+.
              </p>
            </div>
          </div>

          {/* Right: Pricing Summary */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Starts at</span>
                  <span className="text-2xl font-bold">₹{experience.price}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600">Date</span>
                  <span className="font-semibold">
                    {selectedDate ? selectedDate : "-"}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600">Time</span>
                  <span className="font-semibold">{selectedTime || "-"}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600">Qty</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded border border-gray-300 hover:bg-gray-50"
                    >
                      -
                    </button>
                    <span className="font-semibold">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 rounded border border-gray-300 hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">₹{calculateSubtotal()}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Taxes</span>
                  <span className="font-semibold">₹{calculateTaxes()}</span>
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-2xl font-bold">₹{calculateTotal()}</span>
                </div>
              </div>

              <button
                onClick={handleConfirm}
                disabled={!selectedDate || !selectedTime}
                className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-black font-semibold py-3 rounded-lg transition"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}