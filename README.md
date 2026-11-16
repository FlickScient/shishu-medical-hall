# Shishu Medical Hall

A bilingual public pharmacy website and private store-management workspace. This is **not** an online medicine checkout shop.

## Stack
- Next.js App Router + TypeScript
- Tailwind CSS, Framer Motion and Lucide
- Neon PostgreSQL
- Neon Auth (Better Auth) + Neon Data API
- PostgREST-compatible Neon SDK client

## Neon project
The dedicated Neon project is **Shishu Medical Hall**.

- Project ID: `shy-bird-96938950`
- Region: `aws-ap-southeast-1` (Singapore)
- Database: `shishu_medical_hall`
- Branch: `main`
- Neon Auth and Data API are enabled.

## Environment variables
Copy `.env.example` to `.env.local` and configure:

- `NEON_AUTH_BASE_URL`
- `NEXT_PUBLIC_NEON_AUTH_URL`
- `NEON_DATA_API_URL`
- `NEXT_PUBLIC_NEON_DATA_API_URL`
- `DATABASE_URL` (server-only connection string for future server-side SQL/Drizzle work)

Never expose `DATABASE_URL` to browser code or commit real credentials.

## First owner setup
1. Configure the Neon environment variables in the deployment.
2. Open `/setup`.
3. Create the first verified account with the one-time private setup code supplied to the project owner.
4. Sign in after email verification if prompted. The code is single-use and expires after seven days.
5. The first account becomes the store Owner. The setup code is not stored in this repository.

## Team roles
- **Owner:** full access, invitations, member management and finances.
- **Co-owner:** full operational and financial access.
- **Editor:** medicines, stock, suppliers, shortages and non-financial operations only.

Financial access is enforced with PostgreSQL Row Level Security, not just by hiding navigation. Purchase orders include costs and are restricted to Owner / Co-owner.

## Current modules
- Amount-first cashbook transactions and timeline
- Daily sales and gross-profit tracking
- Inventory, batches, low-stock and expiry tracking
- Customer due and supplier debt ledgers
- Supplier and MPO directory
- Medicine search catalogue (no complete Medex import is claimed)
- Shortage requests
- Internal purchase cart and purchase-order history
- Team invitations and role management
- Store profile settings wired to the public homepage
- Public Bangla / English language switch
- Daily dashboard figures and reports

## Local setup
1. Install Node.js 20.9+.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local` and add the Neon values.
4. Run `npm run dev`.

A GitHub Actions workflow runs `npm install` and `npm run build` on pushes to `main`. Vercel deployment still requires a Vercel project linked to this repository and the Neon environment variables configured there.
