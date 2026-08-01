# AgroHub — AI Crop Disease & Pest Detection

AI-powered crop intelligence for modern farmers. Detect diseases, identify pests, get crop
suggestions, and join live farm streams — free, with no sign-up.

Built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, the **Vercel AI SDK**,
and **Groq** vision models.

## Features

- **Disease Detection** — upload an image, a video (we extract the best frame automatically),
  or capture a live stream frame; AI returns the disease, confidence, symptoms, prevention,
  and treatment.
- **Pest Detection** — same image / video / live-stream support for pest identification and
  control methods.
- **Live Stream Camera** — open your webcam (front/back toggle on mobile), pause, and capture
  a frame for instant analysis.
- **Crop Suggestions** — personalized crop picks based on soil type, pH, season, and climate.
- **Live Streams** — browse live and upcoming farm broadcasts.
- **Agri-Tech Insights** — technology comparisons with cost breakdowns.
- **Community Gallery** — share and browse farm images and videos.
- Responsive design, SEO (sitemap/robots/OG), and a custom "Saffron Harvest" theme.

## Project Structure

```
├── app/                    # Routes (App Router)
│   ├── api/
│   │   ├── analyze-disease/  # POST: AI disease analysis (vision model)
│   │   └── analyze-pest/     # POST: AI pest analysis (vision model)
│   ├── disease-detection/    # Disease detector page
│   ├── pest-detection/       # Pest detector page
│   ├── crop-suggestions/     # Crop recommendation page
│   ├── livestream/           # Live stream page
│   ├── gallery/              # Community gallery
│   ├── agri-tech/            # Agri-tech insights
│   ├── about/ contact/       # Marketing pages
│   ├── layout.tsx            # Fonts, metadata, theme bootstrap
│   └── page.tsx              # Landing page
├── components/
│   ├── layout/               # Navbar, Footer, PageHeader
│   ├── detectors/            # DiseaseDetector, PestDetector, CameraStream
│   └── ui/                   # shadcn-style primitives
├── lib/
│   ├── ai.ts                 # Groq/OpenAI vision calls + payload validation
│   ├── media.ts              # Client-side video frame extraction / image JPEG conversion
│   └── db/                   # Optional Postgres schema (drizzle)
├── public/                   # Favicon/logo, OG image
├── render.yaml               # Render blueprint for one-click deploy
└── .env.example              # Environment variable template
```

## Getting Started

```bash
npm install
cp .env.example .env.local   # add your GROQ_API_KEY
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable                | Required | Description                                                  |
| ----------------------- | -------- | ------------------------------------------------------------ |
| `GROQ_API_KEY`          | Yes*     | Groq key used for AI image analysis (https://console.groq.com/keys) |
| `GROQ_MODEL`            | No       | Vision model (default `qwen/qwen3.6-27b`, must support image input) |
| `OPENAI_API_KEY`        | No       | Fallback provider if `GROQ_API_KEY` is not set               |
| `OPENAI_MODEL`          | No       | OpenAI vision model (default `gpt-4o-mini`)                  |
| `DATABASE_URL`          | No       | Optional Postgres URL (drizzle schema provided)              |
| `NEXT_PUBLIC_SITE_URL`  | No       | Canonical URL for SEO (default `https://agrohub.onrender.com`) |
| `PORT`                  | No       | Server port for `npm start` (default `3000`)                 |

\* Without a key, pages work but analysis returns a clear "not configured" message.

## Deploy to Render

Two options:

**Option A — Blueprint (recommended):** push this repo to GitHub, then in Render
Dashboard → **New → Blueprint**, connect the repo. `render.yaml` auto-creates the web
service. Add `GROQ_API_KEY` (and optional `DATABASE_URL`) as env vars.

**Option B — Manual:** create a new **Web Service** pointing at the repo:

- Build command: `npm install && npm run build`
- Start command: `npm start` (reads the `PORT` Render provides)
- Environment: add `GROQ_API_KEY`, `GROQ_MODEL=qwen/qwen3.6-27b`

## Scripts

| Command                | Description                          |
| ---------------------- | ------------------------------------ |
| `npm run dev`          | Start dev server                     |
| `npm run build`        | Production build                     |
| `npm start`            | Production server (uses `$PORT`)     |
| `npm run lint`         | ESLint                               |
| `npm run typecheck`    | TypeScript check                     |


