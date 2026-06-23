# X Clash Offer Tracker

Real shop value analysis for X Clash — no ingame fluff, calculated against Daily Must-Buy baseline.

## Setup in 4 steps

### 1. Supabase (free database)

1. Go to https://supabase.com and create a free account
2. Create a new project
3. Go to **SQL Editor** and paste the contents of `supabase-schema.sql` → Run
4. Go to **Settings > API** and copy:
   - Project URL
   - anon public key

### 2. Configure environment

Copy `.env.example` to `.env.local` and fill in:

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_ADMIN_PASSWORD=choose_a_password
```

### 3. Deploy to Vercel (free hosting)

1. Push this folder to a GitHub repository
2. Go to https://vercel.com and sign in with GitHub
3. Click **New Project** → Import your repo
4. Under **Environment Variables**, add the 3 variables from your `.env.local`
5. Click **Deploy**

Done! You get a URL like `xclash-offer-tracker.vercel.app`

### 4. Local development (optional)

```bash
npm install
npm run dev
```

## Usage

- **Public view**: anyone with the URL can see all packages and value scores
- **Admin**: enter your password in the top-right to unlock add/edit/delete
- **Discord export**: click 📤 on any package to copy Discord-formatted text or embed JSON

## How value is calculated

- Baseline = 23 Daily Must-Buy + Weekly Standard packs @ their price
- For each item type, the **worst** $/unit rate from baselines is used as anchor (100%)
- Event/special packages are scored against this — anything above 100% is better value than standard
- Speed Ups normalized to hours (5min = 0.083h), Tech Speed Ups tracked separately
- Pack Points ignored entirely
