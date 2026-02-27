# InterviewGenie

AI-powered mock interview platform with real-time voice practice and instant feedback.

## Features

- **Voice AI Interviews** - Practice with an AI interviewer that conducts real-time voice conversations
- **Instant Feedback** - Get detailed performance analysis with scores across multiple categories
- **Customizable Interviews** - Choose job role, experience level, and tech stack
- **Company Simulations** - Practice with cover images from popular tech companies
- **User Authentication** - Secure sign-in via Firebase

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI
- **AI/Voice**: Vapi (voice AI), Google AI (Gemini for feedback)
- **Database**: Firebase (Firestore)
- **Authentication**: Firebase Auth
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

Create a `.env.local` file with your Firebase and Vapi credentials:

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
FIREBASE_ADMIN_PRIVATE_KEY=
VAPI_API_KEY=
GOOGLE_API_KEY=
```

## Project Structure

```
app/                    # Next.js App Router pages
  (root)/              # Main app routes (home, interview)
  (auth)/              # Authentication pages (sign-in, sign-up)
components/            # React components
  ui/                  # shadcn/ui components
lib/                   # Utilities and actions
  actions/             # Server actions (auth, general)
firebase/              # Firebase client & admin config
types/                 # TypeScript type definitions
constants/             # App constants and configurations
```

## License

MIT
