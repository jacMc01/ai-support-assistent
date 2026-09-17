# AI Support Assistant

An AI-powered customer support workspace that analyzes incoming support messages and generates professional, empathetic responses — all in one place.

Built with **Next.js 16**, **React 19**, **TypeScript**, **Tailwind CSS v4**, and **Claude Opus 4.7** via the Anthropic API.

---

## What it does

Paste any customer support message and the app will:

1. **Analyze the request** — detects category, priority level, and customer sentiment
2. **Summarize the issue** — a concise 1–2 sentence summary of the problem
3. **Generate a suggested response** — a professional, empathetic reply ready to send
4. **Score the response quality** — rates Clarity, Helpfulness, Professionalism, and Instruction Following (0–100)

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router + Turbopack) |
| UI | React 19 + TypeScript |
| Styling | Tailwind CSS v4 |
| AI | Claude Opus 4.7 (Anthropic) |
| SDK | `@anthropic-ai/sdk` |

---

## Getting started

### 1. Clone the repository

```bash
git clone https://github.com/jacMc01/ai-support-assistent.git
cd ai-support-assistent
```

### 2. Install dependencies

```bash
npm install
```

### 3. Add your Anthropic API key

Create a `.env.local` file in the root of the project:

```bash
ANTHROPIC_API_KEY=your_api_key_here
```

Get your API key at [console.anthropic.com](https://console.anthropic.com). You need credits on your account for the API to work.

> `.env.local` is listed in `.gitignore` — your key will never be uploaded to GitHub.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## How to use

1. Paste a customer message into the text area (or click **Use example message ↗**)
2. Click **Analyze Request**
3. Wait a few seconds while Claude processes the message
4. Review the analysis, read the suggested response, and check the quality scores
5. Copy and personalize the response before sending it to the customer

---

## Project structure

```
src/
  app/
    page.tsx              ← Main UI (all 4 steps)
    layout.tsx            ← Base page layout
    globals.css           ← Global styles
    api/
      analyze/
        route.ts          ← POST endpoint that calls Claude
.env.local                ← Your API key (not committed to git)
package.json              ← Dependencies and scripts
```

---

## Available scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run start     # Start production server
npm run lint      # Run ESLint
```

---

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | Yes | Your Anthropic API key |

---

## License

MIT
