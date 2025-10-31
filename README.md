
# BookIt — Experiences & Slots

A fullstack demo app for browsing travel experiences, viewing available timeslots, and making bookings. Built with Next.js, TypeScript, TailwindCSS and MongoDB.


## Tech stack and libraries used

- Framework: Next.js 16 (App Router)
- Language: TypeScript
- Styling: TailwindCSS
- Database: MongoDB with Mongoose
- Routing & APIs: Next.js App Router (server handlers)
- Other notable libraries: dotenv, lucide-react, mongodb, mongoose

Check `package.json` for the full dependency list.

## Project features

- Home page: list of experiences fetched from the backend API
- Experience details page: shows description, images, and available timeslots
- Booking flow: choose a slot, enter user info, apply promo codes, and confirm booking
- Promo code validation endpoint
- Seed script to populate the database with mock experiences and timeslots
- Mongoose models for Experience, Slot, Booking and PromoCode
- Server-side APIs under `src/app/api/experiences` and `src/app/api/bookings`

## Quick setup

1. Install dependencies

```bash
npm install
```

2. Create a `.env.local` in the project root and add your MongoDB connection string:

```
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/<dbname>?retryWrites=true&w=majority
```

3. Seed the database with mock data (optional but recommended):

```bash
npx tsx src/scripts/seed.ts
```

4. Run the development server

```bash
npm run dev
```

5. Open http://localhost:3000

## How to test the APIs

- GET /api/experiences — list experiences
- GET /api/experiences/:id — get details for one experience (includes timeslots)
- POST /api/bookings — create a booking (expects booking payload)
- POST /api/promo/validate — validate a promo code

Use curl, Postman, or the frontend UI to exercise the endpoints.

## Deployment

Recommended hosts: Vercel (Next.js), Railway, Render. Ensure the `MONGODB_URI` environment variable is set in your host's dashboard.

## Notes

- The repo includes a `src/scripts/seed.ts` script that inserts mock data. Run it after you set `MONGODB_URI`.
- If you change the models, re-run the seed script or update the DB manually.

## Contributing

If you'd like to contribute or request changes, open an issue or submit a PR. For help customizing the README or the project, tell me what you want and I can apply edits.

## License

This project is provided as-is for learning and demonstration. Add a license file if you intend to publish or share the code publicly.
