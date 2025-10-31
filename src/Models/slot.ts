// Slot Model - Manages time slot availability for experiences
// Includes double-booking prevention logic

import mongoose, { Schema, Model, Document } from 'mongoose';

export interface ISlot extends Document {
  _id: string;
  experienceId: mongoose.Types.ObjectId;
  date: Date;
  timeSlot: string;
  totalSpots: number;
  bookedSpots: number;
  availableSpots: number;
  pricePerPerson: number;
  status: 'available' | 'soldout';
  createdAt: Date;
  updatedAt: Date;
}

const SlotSchema = new Schema<ISlot>(
  {
    experienceId: {
      type: Schema.Types.ObjectId,
      ref: 'Experience',
      required: [true, 'Experience ID is required'],
      index: true,
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      index: true,
    },
    timeSlot: {
      type: String,
      required: [true, 'Time slot is required'],
      trim: true,
      // Examples: "9:00 AM - 12:00 PM", "1:00 PM - 4:00 PM"
    },
    totalSpots: {
      type: Number,
      required: [true, 'Total spots is required'],
      min: [1, 'Total spots must be at least 1'],
      default: 20,
    },
    bookedSpots: {
      type: Number,
      required: true,
      min: [0, 'Booked spots cannot be negative'],
      default: 0,
    },
    availableSpots: {
      type: Number,
      required: true,
      min: [0, 'Available spots cannot be negative'],
    },
    pricePerPerson: {
      type: Number,
      required: [true, 'Price per person is required'],
      min: [0, 'Price cannot be negative'],
    },
    status: {
      type: String,
      enum: ['available', 'soldout'],
      default: 'available',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient queries
SlotSchema.index({ experienceId: 1, date: 1, timeSlot: 1 }, { unique: true });
SlotSchema.index({ date: 1, status: 1 });

// Pre-save middleware to calculate availableSpots and update status
SlotSchema.pre('save', function (next) {
  this.availableSpots = this.totalSpots - this.bookedSpots;
  this.status = this.availableSpots > 0 ? 'available' : 'soldout';
  next();
});

// Method to book spots (with double-booking prevention)
SlotSchema.methods.bookSlots = async function (numberOfPeople: number) {
  if (this.availableSpots < numberOfPeople) {
    throw new Error('Not enough spots available');
  }

  // Atomic update to prevent race conditions
  const updated = await Slot.findOneAndUpdate(
    {
      _id: this._id,
      availableSpots: { $gte: numberOfPeople },
    },
    {
      $inc: { bookedSpots: numberOfPeople },
    },
    { new: true }
  );

  if (!updated) {
    throw new Error('Failed to book slots - may have been booked by another user');
  }

  return updated;
};

// Static method to get available slots for an experience
SlotSchema.statics.getAvailableSlots = function (
  experienceId: string,
  startDate?: Date,
  endDate?: Date
) {
  const query: any = {
    experienceId,
    status: 'available',
    date: { $gte: startDate || new Date() },
  };

  if (endDate) {
    query.date.$lte = endDate;
  }

  return this.find(query).sort({ date: 1, timeSlot: 1 });
};

const Slot: Model<ISlot> =
  mongoose.models.Slot || mongoose.model<ISlot>('Slot', SlotSchema);

export default Slot;