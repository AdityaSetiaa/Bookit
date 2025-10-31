// Booking Model - Stores all booking transactions
// Includes reference ID generation and pricing details

import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IBooking extends Document {
  _id: string;
  referenceId: string;
  experienceId: mongoose.Types.ObjectId;
  experienceTitle: string;
  experienceLocation: string;
  slotId: mongoose.Types.ObjectId;
  date: string;
  dateRaw: Date;
  timeSlot: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  numberOfPeople: number;
  subtotal: number;
  promoCode?: string;
  discount: number;
  finalPrice: number;
  bookingDate: Date;
  status: 'confirmed' | 'pending' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    referenceId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    experienceId: {
      type: Schema.Types.ObjectId,
      ref: 'Experience',
      required: [true, 'Experience ID is required'],
      index: true,
    },
    experienceTitle: {
      type: String,
      required: [true, 'Experience title is required'],
      trim: true,
    },
    experienceLocation: {
      type: String,
      required: [true, 'Experience location is required'],
      trim: true,
    },
    slotId: {
      type: Schema.Types.ObjectId,
      ref: 'Slot',
      required: [true, 'Slot ID is required'],
      index: true,
    },
    date: {
      type: String,
      required: [true, 'Display date is required'],
    },
    dateRaw: {
      type: Date,
      required: [true, 'Raw date is required'],
      index: true,
    },
    timeSlot: {
      type: String,
      required: [true, 'Time slot is required'],
      trim: true,
    },
    userName: {
      type: String,
      required: [true, 'User name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    userEmail: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      index: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    userPhone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number'],
    },
    numberOfPeople: {
      type: Number,
      required: [true, 'Number of people is required'],
      min: [1, 'At least 1 person is required'],
      max: [20, 'Maximum 20 people allowed per booking'],
    },
    subtotal: {
      type: Number,
      required: [true, 'Subtotal is required'],
      min: [0, 'Subtotal cannot be negative'],
    },
    promoCode: {
      type: String,
      trim: true,
      uppercase: true,
    },
    discount: {
      type: Number,
      required: true,
      min: [0, 'Discount cannot be negative'],
      default: 0,
    },
    finalPrice: {
      type: Number,
      required: [true, 'Final price is required'],
      min: [0, 'Final price cannot be negative'],
    },
    bookingDate: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
    status: {
      type: String,
      enum: ['confirmed', 'pending', 'cancelled'],
      default: 'confirmed',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
BookingSchema.index({ userEmail: 1, bookingDate: -1 });
BookingSchema.index({ experienceId: 1, dateRaw: 1 });
BookingSchema.index({ status: 1, bookingDate: -1 });

// Generate reference ID before saving
BookingSchema.pre('save', function (next) {
  if (!this.referenceId) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.referenceId = `BK${timestamp}${random}`;
  }
  next();
});

// Static method to generate unique reference ID
BookingSchema.statics.generateReferenceId = function (): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `BK${timestamp}${random}`;
};

// Static method to find booking by reference ID
BookingSchema.statics.findByReferenceId = function (referenceId: string) {
  return this.findOne({ referenceId }).populate('experienceId').populate('slotId');
};

// Static method to get user bookings
BookingSchema.statics.getUserBookings = function (email: string) {
  return this.find({ userEmail: email.toLowerCase() })
    .populate('experienceId')
    .sort({ bookingDate: -1 });
};

const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);

export default Booking;