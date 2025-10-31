import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
  _id: string;
  referenceId: string;
  experienceId: mongoose.Types.ObjectId;
  experienceTitle: string;
  experienceLocation: string;
  slotId?: mongoose.Types.ObjectId;
  date: string;
  dateRaw: Date;
  timeSlot: string;
  userName: string;
  userEmail: string;
  numberOfPeople: number;
  subtotal: number;
  promoCode?: string;
  discount: number;
  finalPrice: number;
  bookingDate: Date;
  status: "confirmed" | "pending" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    referenceId: { type: String, required: true, unique: true },
    experienceId: { type: Schema.Types.ObjectId, ref: "Experience", required: true },
    experienceTitle: { type: String, required: true },
    experienceLocation: { type: String, required: true },
    slotId: { type: Schema.Types.ObjectId, ref: "Slot", required: false }, 
    date: { type: String, required: true },
    dateRaw: { type: Date, required: true },
    timeSlot: { type: String, required: true },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    numberOfPeople: { type: Number, required: true },
    subtotal: { type: Number, required: true },
    promoCode: { type: String },
    discount: { type: Number, default: 0 },
    finalPrice: { type: Number, required: true },
    bookingDate: { type: Date, required: true },
    status: { type: String, enum: ["confirmed", "pending", "cancelled"], default: "confirmed" },
  },
  { timestamps: true }
);
export default mongoose.models.Booking || mongoose.model("Booking", BookingSchema);

