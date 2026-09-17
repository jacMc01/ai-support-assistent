"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const example = "I was charged twice for my subscription and need help.";
const metrics = [
  { key: "clarity", label: "Clarity" },
  { key: "helpfulness", label: "Helpfulness" },
  { key: "professionalism", label: "Professionalism" },
  { key: "instructionFollowing", label: "Instruction Following" },
] as const;

type MetricKey = (typeof metrics)[number]["key"];

interface AnalysisResult {
  category: string;
  priority: string;
  sentiment: string;
  summary: string;
  response: string;
  scores: Record<MetricKey, number>;
  overallScore: number;
}

function Sparkle({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Z" />
      <path d="m20 2 .6 1.4L22 4l-1.4.6L20 6l-.6-1.4L18 4l1.4-.6L20 2Z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function ScoreBar({ value }: { value: number }) {
  const pct = Math.min(100, Math.max(0, value));
  const color = pct >= 80 ? "bg-emerald-500" : pct >= 60 ? "bg-violet-500" : pct >= 40 ? "bg-amber-500" : "bg-red-400";
  return (
    <div className="mt-4 h-1.5 rounded-full bg-slate-100 dark:bg-slate-700">
      <div className={`h-1.5 rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

function priorityColor(p: string) {
  if (p === "Urgent") return "text-red-600 dark:text-red-400";
  if (p === "High") return "text-orange-500 dark:text-orange-400";
  if (p === "Medium") return "text-amber-500 dark:text-amber-400";
  return "text-emerald-600 dark:text-emerald-400";
}

function sentimentColor(s: string) {
  if (s === "Angry") return "text-red-600 dark:text-red-400";
  if (s === "Frustrated") return "text-orange-500 dark:text-orange-400";
  if (s === "Positive") return "text-emerald-600 dark:text-emerald-400";
  return "text-slate-600 dark:text-slate-400";
}

export default function Home() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const dark = stored === "dark" || (!stored && prefersDark);
    setIsDark(dark);
    document.documentElement.classList.toggle("dark", dark);
  }, []);

  function toggleDark() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!message.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200/80 bg-white dark:border-slate-700/60 dark:bg-slate-900">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <Link href="/" className="flex items-center gap-3 text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 text-white">
              <Sparkle />
            </span>
            Support Studio
          </Link>
          <div className="flex items-center gap-3">
            <span className="rounded-full border border-violet-100 bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700 dark:border-violet-800/60 dark:bg-violet-900/30 dark:text-violet-400">
              {loading ? "Analyzing…" : result ? "Ready" : "AI Ready"}
            </span>
            <button
              onClick={toggleDark}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-100"
            >
              {isDark ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-12">
        <div className="mb-9">
          <p className="mb-3 text-xs font-semibold tracking-[0.18em] text-violet-600 dark:text-violet-400 uppercase">Your support workspace</p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl">AI Support Assistant</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500 dark:text-slate-400 sm:text-base">
            Analyze customer support requests and generate thoughtful, AI-assisted responses — all in one place.
          </p>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[1.05fr_1fr]">
          {/* Step 01 */}
          <section className="panel p-6 sm:p-7" aria-labelledby="message-label">
            <div className="mb-6 flex items-center gap-3">
              <span className="step">01</span>
              <h2 className="section-title">Start with a message</h2>
            </div>
            <form onSubmit={handleSubmit}>
              <label id="message-label" htmlFor="customer-message" className="mb-2.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Customer Message
              </label>
              <textarea
                id="customer-message"
                required
                maxLength={5000}
                value={message}
                onChange={(e) => { setMessage(e.target.value); setError(""); }}
                placeholder={example}
                aria-describedby="message-hint"
                className="min-h-52 w-full resize-y rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-sm leading-7 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 dark:border-slate-600 dark:bg-slate-900/50 dark:text-slate-200 dark:placeholder:text-slate-600 dark:focus:border-violet-500 dark:focus:ring-violet-900/40"
              />
              <div className="mt-2 flex justify-between gap-3 text-xs text-slate-400 dark:text-slate-500">
                <span id="message-hint">Paste a request or try an example.</span>
                <span>{message.length.toLocaleString()} / 5,000</span>
              </div>
              <button
                type="button"
                onClick={() => { setMessage(example); setError(""); }}
                className="mt-4 text-xs font-medium text-violet-600 transition hover:text-violet-800 dark:text-violet-400 dark:hover:text-violet-300"
              >
                Use example message <span aria-hidden="true">↗</span>
              </button>
              <button
                type="submit"
                disabled={!message.trim() || loading}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3.5 text-sm font-medium text-white shadow-sm transition hover:bg-violet-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-600 disabled:cursor-not-allowed disabled:bg-violet-300 disabled:shadow-none dark:disabled:bg-violet-900/50 dark:disabled:text-violet-400"
              >
                {loading ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                      <path d="M12 2a10 10 0 0 1 10 10" />
                    </svg>
                    Analyzing…
                  </>
                ) : (
                  <>
                    <Sparkle className="h-4 w-4" />
                    Analyze Request
                    <span className="ml-1" aria-hidden="true">→</span>
                  </>
                )}
              </button>
              {error && (
                <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-xs leading-5 text-red-700 dark:bg-red-900/20 dark:text-red-400">
                  {error}
                </p>
              )}
            </form>
          </section>

          <div className="space-y-6">
            {/* Step 02 */}
            <section className="panel p-6 sm:p-7" aria-labelledby="analysis-title">
              <div className="mb-6 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="step">02</span>
                  <h2 id="analysis-title" className="section-title">Request Analysis</h2>
                </div>
                <span className="text-xs text-slate-400 dark:text-slate-500">{result ? "Complete" : "Awaiting request"}</span>
              </div>
              <dl className="grid grid-cols-3 gap-3">
                {(["Category", "Priority", "Sentiment"] as const).map((label) => {
                  const key = label.toLowerCase() as "category" | "priority" | "sentiment";
                  const val = result?.[key];
                  return (
                    <div key={label} className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 dark:border-slate-700/50 dark:bg-slate-900/40">
                      <dt className="text-xs text-slate-500 dark:text-slate-400">{label}</dt>
                      <dd
                        className={`mt-3 text-sm font-medium ${
                          val
                            ? label === "Priority"
                              ? priorityColor(val)
                              : label === "Sentiment"
                              ? sentimentColor(val)
                              : "text-slate-800 dark:text-slate-200"
                            : "text-slate-400 dark:text-slate-600 text-lg"
                        }`}
                        aria-label={val ?? "Not analyzed"}
                      >
                        {val ?? "—"}
                      </dd>
                    </div>
                  );
                })}
              </dl>
              <h3 className="mt-6 text-sm font-medium text-slate-700 dark:text-slate-300">Summary</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                {result?.summary ?? <span className="text-slate-400 dark:text-slate-600">A concise summary of the customer&apos;s request will appear here.</span>}
              </p>
            </section>

            {/* Step 03 */}
            <section className="panel p-6 sm:p-7" aria-labelledby="response-title">
              <div className="mb-5 flex items-center gap-3">
                <span className="step">03</span>
                <h2 id="response-title" className="section-title">Suggested Response</h2>
              </div>
              {result?.response ? (
                <div className="rounded-xl border border-violet-100 bg-violet-50/40 p-5 dark:border-violet-800/40 dark:bg-violet-900/20">
                  <span className="mb-3 block text-violet-500 dark:text-violet-400"><Sparkle /></span>
                  <p className="text-sm leading-7 text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{result.response}</p>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-5 dark:border-slate-700 dark:bg-slate-900/30">
                  <span className="mb-3 block text-violet-400 dark:text-violet-600"><Sparkle /></span>
                  <p className="text-sm leading-7 text-slate-400 dark:text-slate-600">Your AI-assisted response will appear here, ready for you to review and personalize.</p>
                </div>
              )}
            </section>
          </div>

          {/* Step 04 */}
          <section className="panel p-6 sm:p-7 lg:col-span-2" aria-labelledby="review-title">
            <div className="flex items-center gap-3">
              <span className="step">04</span>
              <h2 id="review-title" className="section-title">AI Quality Review</h2>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">A second look at the response, across the qualities that matter.</p>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-[repeat(4,1fr)_1.1fr]">
              {metrics.map(({ key, label }) => {
                const score = result?.scores?.[key];
                return (
                  <div key={key} className="py-2">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-xs font-medium text-slate-600 dark:text-slate-400">{label}</h3>
                      <span className={`text-sm ${score != null ? "text-slate-700 dark:text-slate-300 font-medium" : "text-slate-400 dark:text-slate-600"}`} aria-label={score != null ? `${score} out of 100` : "Not scored"}>
                        {score != null ? score : "—"}
                      </span>
                    </div>
                    {score != null ? (
                      <ScoreBar value={score} />
                    ) : (
                      <div className="mt-4 h-1.5 rounded-full bg-slate-100 dark:bg-slate-700" />
                    )}
                    <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">
                      {score != null
                        ? score >= 80 ? "Excellent" : score >= 60 ? "Good" : score >= 40 ? "Needs improvement" : "Poor"
                        : "Awaiting evaluation"}
                    </p>
                  </div>
                );
              })}
              <div className="rounded-xl bg-violet-50 px-5 py-4 sm:col-span-2 lg:col-span-1 dark:bg-violet-900/20">
                <h3 className="text-xs font-medium text-violet-700 dark:text-violet-400">Overall Score</h3>
                <p className="mt-2 text-2xl font-semibold text-violet-600 dark:text-violet-400">
                  {result?.overallScore != null ? result.overallScore : <span className="text-violet-400 dark:text-violet-600">—</span>}
                  {" "}<span className="text-xs font-normal text-violet-400 dark:text-violet-600">/ 100</span>
                </p>
                {result?.overallScore != null && (
                  <p className="mt-1 text-xs text-violet-500 dark:text-violet-500">
                    {result.overallScore >= 80 ? "Great response quality" : result.overallScore >= 60 ? "Good, minor improvements possible" : "Consider revising before sending"}
                  </p>
                )}
              </div>
            </div>
          </section>
        </div>

        <footer className="mt-8 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 dark:text-slate-600">
          <span>Built for more thoughtful customer support.</span>
          <span>AI Support Assistant · Powered by Claude</span>
        </footer>
      </main>
    </div>
  );
}
