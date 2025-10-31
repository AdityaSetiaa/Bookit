import mongoose from "mongoose";
import Experience from "../Models/Experience";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

export async function connectDB() {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(process.env.MONGO_URI as string);
}

export async function getAllExperiences() {
  await connectDB();
  const experiences = await Experience.find({});
  return experiences;
}
