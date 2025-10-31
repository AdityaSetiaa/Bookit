// models/PromoCode.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPromoCode extends Document {
  code: string;
  discountType: "percentage" | "flat";
  discountValue: number;
  expiryDate?: Date;
  isActive: boolean;
  validatePromo(subtotal: number): { valid: boolean; discount?: number; message: string };
}

const PromoCodeSchema = new Schema<IPromoCode>(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    discountType: { type: String, enum: ["percentage", "flat"], required: true },
    discountValue: { type: Number, required: true },
    expiryDate: Date,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

PromoCodeSchema.methods.validatePromo = function (subtotal: number) {
  if (!this.isActive)
    return { valid: false, message: "Promo code is inactive" };
  if (this.expiryDate && new Date() > this.expiryDate)
    return { valid: false, message: "Promo code has expired" };

  let discount =
    this.discountType === "percentage"
      ? Math.round((subtotal * this.discountValue) / 100)
      : this.discountValue;

  return { valid: true, discount, message: `${this.code} applied!` };
};

const PromoCode: Model<IPromoCode> =
  mongoose.models.PromoCode || mongoose.model("PromoCode", PromoCodeSchema);

export default PromoCode;
