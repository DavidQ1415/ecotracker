# EcoTrack - Ecological Footprint Tracker

This is a [Next.js](https://nextjs.org) project for tracking your ecological footprint with PostgreSQL and Prisma backend.

## Features

- User authentication with NextAuth.js
- PostgreSQL database with Prisma ORM
- Survey tracking for consumption, food, home, and transport categories
- Historical survey data storage
- Ecological footprint score calculation

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/ecotrack?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

Generate a secret key:
```bash
openssl rand -base64 32
```

### 3. Set Up Database

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database
npm run db:push

# Or create a migration
npm run db:migrate
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### 5. View Database (Optional)

```bash
npm run db:studio
```

This opens Prisma Studio where you can view and manage your database.

## Backend Setup

For detailed backend setup instructions, see [SETUP.md](./SETUP.md).

## Database Schema

- **User**: Stores user accounts with email and hashed passwords
- **Survey**: Stores survey responses with answers for each category and calculated footprint scores

## API Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/[...nextauth]` - Sign in
- `GET /api/surveys` - Get all surveys for authenticated user
- `POST /api/surveys` - Create a new survey
- `GET /api/surveys/[id]` - Get a specific survey
- `PUT /api/surveys/[id]` - Update a survey
- `DELETE /api/surveys/[id]` - Delete a survey

## Project Structure

- `prisma/schema.prisma` - Database schema
- `lib/prisma.ts` - Prisma client instance
- `lib/auth.ts` - NextAuth configuration
- `lib/survey.ts` - Survey utility functions
- `app/api/auth/` - Authentication API routes
- `app/api/surveys/` - Survey API routes
- `components/providers.tsx` - Session provider wrapper

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
