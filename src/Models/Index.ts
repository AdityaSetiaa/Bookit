// Centralized model exports
// Makes imports cleaner: import { Experience, Booking } from '@/models'

export { default as Experience } from './Experience';
export { default as Slot } from './slot';
export { default as Booking } from './Booking';
export { default as PromoCode } from './PromoCode';

// Re-export types
export type { IExperience } from './Experience';
export type { ISlot } from './slot';
export type { IBooking } from './Booking';
export type { IPromoCode } from './PromoCode';
// ```

// ---

// ## **File Summary:**
// ```
// ✅ lib/mongodb.ts          - Database connection (singleton pattern)
// ✅ models/Experience.ts    - Experience schema & model
// ✅ models/Slot.ts          - Slot schema with booking prevention
// ✅ models/Booking.ts       - Booking schema with reference ID
// ✅ models/PromoCode.ts     - Promo code schema with validation
// ✅ models/index.ts         - Centralized exports