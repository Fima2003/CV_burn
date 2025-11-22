# Resume Roaster

A brutally honest AI-powered resume reviewer that scores your resume and gives you sarcastic (but helpful) feedback.

## Tech Stack

- **Frontend:** Next.js 14+ (App Router), React, Tailwind CSS, Lucide React
- **Backend:** Next.js API Routes
- **AI:** OpenAI API (GPT-3.5-turbo)

## Features

- Paste your resume and get an AI roast
- Score your resume (0-100)
- Receive sarcastic but honest feedback
- Get actual actionable advice
- Copy results to clipboard
- Brutalist dark mode UI with red accents

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create a `.env.local` file in the root directory:

```
OPENAI_API_KEY=your_openai_api_key_here
```

Get your API key from [OpenAI Platform](https://platform.openai.com/account/api-keys).

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## How It Works

1. **Input:** Paste your resume text
2. **Processing:** The app sends it to OpenAI's GPT-3.5-turbo with a custom system prompt
3. **Output:** You receive:
   - A score (0-100)
   - A vibe check (snarky one-liner)
   - Roast points (specific critiques)
   - Redemption advice (actually useful tips)

## File Structure

```
src/
├── app/
│   ├── api/
│   │   └── roast/
│   │       └── route.ts     # OpenAI API integration
│   ├── page.tsx              # Main UI component
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Tailwind styles
└── ...
```

## Customization

### Personalize the Footer

Edit the footer in `src/app/page.tsx`:

```tsx
Built by <span className="text-zinc-300 font-semibold">[Your Name]</span>. Hire me before
I build an AI to replace you.{' '}
<a href="https://linkedin.com/in/yourprofile">LinkedIn</a>
```

### Adjust the Roast Tone

Edit the system prompt in `src/app/api/roast/route.ts` to change how aggressive/sarcastic the roasts are.

### Change Colors

All colors use Tailwind classes. The main accent color is `text-red-500`. Customize in the JSX.

## Deployment

Deploy to [Vercel](https://vercel.com):

```bash
vercel
```

Make sure to add your `OPENAI_API_KEY` to Vercel's environment variables.

## Notes

- Free tier OpenAI accounts have rate limits
- Responses are formatted as JSON for consistency
- The app works client-side (no data persistence)

## License

MIT
