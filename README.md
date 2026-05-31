# Habit Tracker (Next.js + Supabase)

A premium, minimalist, highly responsive Habit Tracker inspired by a systems-style monthly tracker layout.

## Tech Stack

- Next.js (App Router, TypeScript)
- Tailwind CSS
- Supabase (Auth + Postgres)
- Recharts
- Lucide React

## Architecture

```text
app/
  globals.css
  layout.tsx
  page.tsx
components/
  auth/Auth.tsx
  dashboard/DashboardHeader.tsx
  dashboard/HabitDashboard.tsx
  dashboard/HabitGrid.tsx
  dashboard/HabitRow.tsx
  dashboard/ProgressChart.tsx
  providers/SupabaseProvider.tsx
lib/
  date.ts
  metrics.ts
  supabase/client.ts
types/
  habit.ts
supabase/
  migrations/20260531224000_init_habits.sql
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Add environment variables:

```bash
cp .env.example .env.local
```

3. Fill `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

4. Run Supabase SQL migration from:

- `/tmp/workspace/Swastik1100/Habit-Tracker/supabase/migrations/20260531224000_init_habits.sql`

5. Start dev server:

```bash
npm run dev
```

## Supabase Schema + RLS

This project includes:

- `habits` table (`id`, `user_id`, `name`, `created_at`)
- `habit_logs` table (`id`, `habit_id`, `date`, `completed`)
- Unique constraint on `(habit_id, date)` for upsert toggles
- Row-level policies so users can only CRUD their own habits/logs

## Product Features Implemented

- Auth panel (Sign Up / Login) and Sign Out
- Month selector and top dashboard stats
- Per-habit streak + 7-day consistency + progress bars
- Overall progress bar and total tasks completed
- Monthly grid with day-by-day toggle buttons
- Optimistic UI updates for completion toggles with Supabase upsert
- Right-most habit performance percentage column
- Bottom row daily completion percentages
- Recharts area chart for progress over time
- Light mode default + dark mode toggle

## Deployment (Vercel)

- Import the repository in Vercel
- Add the same two `NEXT_PUBLIC_SUPABASE_*` environment variables
- Deploy
