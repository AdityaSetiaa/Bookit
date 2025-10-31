import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IExperience extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  location: string;
  price: number;
  images: string; 
  category: string;
  duration?: string;
  timeSlots?: Array<{
    date: string[];
    time: string[];
  }>;
  createdAt: Date;
  updatedAt: Date;
}const ExperienceSchema = new Schema<IExperience>(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      default: () => new mongoose.Types.ObjectId(),
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    images: {
      type: String,
      required: true,
      validate: {
        validator: function (v: string[]) {
          return v && v.length > 0;
        },
      },
    },
    category: {
      type: String,
      required: true,
      enum: {
        values: ['Adventure', 'Nature', 'Cultural', 'Water Sports', 'Wildlife'],
        message: '{VALUE} is not a valid category',
      },
    },
    timeSlots: {
      type: [
        {
          date: { type: [String], required: true },
          time: { type: [String], required: true },
        },
      ],
      default: undefined,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

ExperienceSchema.index({ category: 1 });
ExperienceSchema.index({ location: 1 });
ExperienceSchema.index({ price: 1 });

ExperienceSchema.virtual('slots', {
  ref: 'Slot',
  localField: '_id',
  foreignField: 'experienceId',
});

const Experience: Model<IExperience> =
  mongoose.models.Experience || mongoose.model<IExperience>('Experience', ExperienceSchema);

export default Experience;


