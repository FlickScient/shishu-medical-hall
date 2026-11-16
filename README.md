# Shishu Medical Hall

Bilingual (Bangla / English) public pharmacy website and private store-management workspace. This is **not** an online medicine checkout store.

## Stack
- Next.js App Router + TypeScript
- Tailwind CSS
- Supabase Auth, Postgres and Row Level Security
- Framer Motion and Lucide icons

## Local setup
1. Install Node.js 20.9+.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local`.
4. Add your Supabase project URL and anon key.
5. Run the SQL in `supabase/schema.sql` in the Supabase SQL editor.
6. Run `npm run dev`.

## Roles
- **Owner:** full access, team management and finances.
- **Co-owner:** financial and operational access.
- **Editor:** medicine, stock, supplier and homepage operations; no financial tables.

Role policies are enforced in Postgres RLS, not only by hiding dashboard navigation.

## Current implementation status
The initial app shell, public homepage, management navigation, Supabase client helpers and first database schema are committed. Operational forms, live queries, invitation flows, bilingual content management, medicine data imports and end-to-end tests are still being implemented. No sample medicine catalogue is represented as a complete Medex dataset.
