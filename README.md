# InterviewGenie

**InterviewGenie** is an AI‑powered mock interview platform built with Next.js. Users can
start a real-time voice conversation with an intelligent interviewer, answer
questions tailored to a job role and tech stack, and receive instant structured
feedback scored across multiple dimensions. The app is intended for
engineering candidates to rehearse and improve their interview skills.

## Features

- **Voice AI Interviews** – an assistant that asks questions and listens via WebRTC
- **Instant Feedback** – a Gemini‑powered analysis that returns numerical scores
  and written comments for each category
- **Customizable Sessions** – pick role, experience level, and technology stack
  to generate relevant question sets or use pre–saved interviews
- **Company Simulations** – cover images and branding from popular tech companies
  make the experience feel like a real corporate interview
- **Real‑time Transcriptions** – interview audio is transcribed on the fly
- **User Accounts** – sign up/sign in using Supabase Auth; session data stored in Supabase

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **UI Components**: shadcn/ui
- **AI/Voice**: Vapi (voice AI), Google AI (Gemini for feedback)
- **Database**: Supabase Database
- **Authentication**: Supabase Auth
- **Form**: React Hook Form, Zod validation

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Environment Variables

The app relies on a few external services. create a `.env.local` (or
`.env`) file at the root with these values before starting the server:

```bash
NEXT_PUBLIC_BASE_URL=https://interview-genie-two.vercel.app/

# vapi is the voice‑AI SDK; use your Vercel/Vapi API key
NEXT_PUBLIC_VAPI_ASSISTANT_ID=
NEXT_PUBLIC_VAPI_API_KEY=

# Gemini / Google AI credentials used for feedback generation
GOOGLE_GENERATIVE_AI_API_KEY=

# supabase configuration (server + client)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=

NEXT_PUBLIC_LOGO_DEV_PUBLISHABLE_KEY=
```

Only variables that begin with `NEXT_PUBLIC_` are available in client
bundles.

## Development

1. Install dependencies:

   ```bash
   npm install
   # or yarn
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`.

3. Mock data and credentials
   - You can seed Supabase with example interviews using the `/scripts/seed.ts` script.
   - Replace real API keys with local/test tokens when running automated tests.

4. Linting and formatting:

   ```bash
   npm run lint
   npm run format
   ```

## Deployment

This project is designed to deploy on Vercel but any platform that supports
Node/Next.js 15 works.

1. Push your code to GitHub/GitLab.
2. Create a new project in your hosting provider and set the environment
   variables from above in the dashboard.
3. For Vercel you can simply run `vercel` from the repository root; it will
   detect the framework and configure the build.

The production build command is the default `next build` and it serves from
`next start`.

## Testing

There are no automated tests at the moment; manual playthroughs and sample
interviews are used during development. Adding Jest/Playwright would be a
natural next step.

## Project Structure

```bash
app/                    # Next.js App Router pages
  (root)/              # Main app routes (home, interview)
  (auth)/              # Authentication pages (sign-in, sign-up)
components/            # React components
  ui/                  # shadcn/ui components
lib/                   # Utilities and actions
  actions/             # Server actions (auth, general)
supabase/              # Supabase client & server helpers
types/                 # TypeScript type definitions
constants/             # App constants and configurations
```

## License

MIT
