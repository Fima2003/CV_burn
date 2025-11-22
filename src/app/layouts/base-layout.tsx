"use client";

import { Check, Copy, FileText, Flame, Loader2, Sparkles, Trash2, Upload } from 'lucide-react';
import type { DeviceLayoutProps } from './types';

const variantStyles = {
  computer: {
    outer: 'relative flex h-screen w-full items-center justify-center overflow-hidden bg-zinc-950 text-zinc-100 font-mono',
    main: 'relative z-10 h-full w-full max-w-6xl px-6 py-16',
    shell: 'flex h-full flex-col gap-10 rounded-[32px] border border-white/10 bg-zinc-950/70 p-8 shadow-[0_0_80px_rgba(244,63,94,0.25)] backdrop-blur-2xl',
    grid: 'grid flex-1 grid-cols-[1.1fr_0.9fr] gap-6 min-h-0',
    inputCard: 'relative flex min-w-0 flex-col overflow-hidden rounded-3xl border border-white/10 bg-black/40 p-6 shadow-inner shadow-red-900/30',
    verdictCard: 'relative flex min-w-0 flex-col overflow-hidden rounded-3xl border border-white/10 bg-black/40 p-6 shadow-2xl shadow-red-500/10',
    inputScroll: 'flex-1 space-y-5 overflow-auto pr-2',
    verdictScroll: 'flex-1 space-y-6 overflow-auto pr-2',
    heroTitle: 'text-4xl',
    heroCopy: 'text-base',
    badgeText: 'text-xs',
    footerText: 'text-xs',
  },
  tablet: {
    outer: 'relative flex min-h-screen w-full flex-col overflow-x-hidden bg-zinc-950 text-zinc-100 font-mono',
    main: 'relative z-10 mx-auto w-full max-w-5xl px-6 py-12',
    shell: 'flex flex-col gap-8 rounded-[28px] border border-white/10 bg-zinc-950/70 p-6 shadow-[0_0_70px_rgba(244,63,94,0.25)] backdrop-blur-xl',
    grid: 'flex flex-col gap-6',
    inputCard: 'relative flex min-w-0 flex-col rounded-3xl border border-white/10 bg-black/45 p-6 shadow-inner shadow-red-900/30',
    verdictCard: 'relative flex min-w-0 flex-col rounded-3xl border border-white/10 bg-black/45 p-6 shadow-2xl shadow-red-500/10',
    inputScroll: 'space-y-5',
    verdictScroll: 'space-y-6',
    heroTitle: 'text-3xl',
    heroCopy: 'text-sm',
    badgeText: 'text-[0.7rem]',
    footerText: 'text-[0.7rem]',
  },
  phone: {
    outer: 'relative flex min-h-screen w-full flex-col overflow-x-hidden bg-zinc-950 text-zinc-100 font-mono',
    main: 'relative z-10 w-full px-4 py-10',
    shell: 'flex flex-col gap-6 rounded-[24px] border border-white/10 bg-zinc-950/80 p-4 shadow-[0_0_60px_rgba(244,63,94,0.25)] backdrop-blur-lg',
    grid: 'flex flex-col gap-5',
    inputCard: 'relative flex min-w-0 flex-col rounded-[22px] border border-white/10 bg-black/50 p-4 shadow-inner shadow-red-900/30',
    verdictCard: 'relative flex min-w-0 flex-col rounded-[22px] border border-white/10 bg-black/50 p-4 shadow-2xl shadow-red-500/10',
    inputScroll: 'space-y-4',
    verdictScroll: 'space-y-5',
    heroTitle: 'text-2xl',
    heroCopy: 'text-xs',
    badgeText: 'text-[0.6rem]',
    footerText: 'text-[0.6rem]',
  },
};

type Variant = keyof typeof variantStyles;

interface BaseLayoutProps extends DeviceLayoutProps {
  variant: Variant;
}

export default function BaseLayout({
  variant,
  resumeInput,
  resumeFile,
  dragActive,
  loading,
  result,
  error,
  copied,
  scoreAccent,
  supportedFileText,
  fileInputRef,
  onFileSelection,
  onDrop,
  onResumeInputChange,
  onRoast,
  onCopy,
  setDragActive,
}: BaseLayoutProps) {
  const styles = variantStyles[variant];

  const copyPayload = result
    ? `RESUME ROAST:\n\nScore: ${result.score}/100\nVibe: ${result.vibe_check}\n\nRoasts:\n${result.roast_points
        .map((point) => `- ${point}`)
        .join('\n')}\n\nAdvice: ${result.redemption_advice}`
    : '';

  const scoreColor = result ? scoreAccent : 'text-zinc-500';

  return (
    <div className={styles.outer}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(248,113,113,0.25),_transparent_65%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(120deg,rgba(244,63,94,0.12)_1px,transparent_1px),linear-gradient(-120deg,rgba(244,63,94,0.08)_1px,transparent_1px)] [background-size:50px_50px]" />
      <div className="pointer-events-none absolute -top-40 -right-24 h-[28rem] w-[28rem] rounded-full bg-red-500/25 blur-3xl animate-orbit" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black via-black/70 to-transparent" />

      <main className={styles.main}>
        <div className={styles.shell}>
          <section className="flex flex-col items-center gap-4 text-center">
            <span className={`inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 uppercase tracking-[0.3em] text-red-300 ${styles.badgeText}`}>
              <Sparkles className="h-4 w-4 text-red-400" /> Brutalist Career Interventions
            </span>
            <div className="space-y-3">
              <h1 className={`font-bold leading-tight text-white ${styles.heroTitle}`}>
                Drop your resume. Get roasted. <span className="text-red-400">Emerge stronger.</span>
              </h1>
              <p className={`text-zinc-400 ${styles.heroCopy}`}>
                Upload a PDF or paste the text. RoastBot will vaporize your buzzwords, score your delusions, and hand you a redemption arc you&apos;ll pretend you thought of.
              </p>
            </div>
            <div className={`flex flex-wrap justify-center gap-4 text-zinc-400 ${styles.badgeText}`}>
              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur">Auto-sarcasm engine v4.0</div>
              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur">FAANG-grade snark</div>
              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur">Score, vibe, roast &amp; redemption</div>
            </div>
          </section>

          <section className={styles.grid}>
            <div className={styles.inputCard}>
              <div className="pointer-events-none absolute inset-0 opacity-30 [background:radial-gradient(circle_at_top,_rgba(248,113,113,0.3),transparent_65%)]" />
              <div className="relative flex flex-col gap-5 h-full">
                <header className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.5em] text-red-400">Input</p>
                  <h2 className="text-2xl font-semibold text-white">Fuel the Roast</h2>
                  <p className="text-xs text-zinc-500 sm:text-sm">Paste text, upload a file, or both. RoastBot will find something to roast.</p>
                </header>

                <div className="flex flex-1 flex-col gap-5">
                  <div className={styles.inputScroll}>
                    <div
                      onDragEnter={(event) => {
                        event.preventDefault();
                        setDragActive(true);
                      }}
                      onDragOver={(event) => {
                        event.preventDefault();
                        setDragActive(true);
                      }}
                      onDragLeave={(event) => {
                        event.preventDefault();
                        setDragActive(false);
                      }}
                      onDrop={onDrop}
                      className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-all duration-300 ${
                        dragActive ? 'border-red-400 bg-red-500/10' : 'border-white/10 bg-zinc-950/60 hover:border-red-400/80'
                      } ${loading ? 'pointer-events-none opacity-60' : ''}`}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input
                        type="file"
                        accept=".pdf,.txt,.md,.markdown"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={(event) => onFileSelection(event.target.files?.[0] ?? null)}
                      />
                      <div className="flex flex-col items-center gap-3">
                        <div className="rounded-full border border-white/10 bg-white/5 p-4 text-red-300">
                          <Upload className="h-6 w-6" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-white">Drag &amp; drop your resume</p>
                          <p className="text-xs text-zinc-500">{supportedFileText}</p>
                        </div>
                      </div>
                      <div className="mt-4 text-xs text-zinc-500">or click to browse</div>
                      <span className="pointer-events-none absolute inset-0 rounded-2xl border border-white/5 opacity-0 transition group-hover:opacity-100" />
                    </div>

                    {resumeFile && (
                      <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-200">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-red-400" />
                          <div>
                            <p className="font-semibold">{resumeFile.name}</p>
                            <p className="text-xs text-zinc-500">{(resumeFile.size / 1024).toFixed(0)} KB</p>
                          </div>
                        </div>
                        <button
                          className={`rounded-full border border-white/10 p-2 text-zinc-400 transition ${
                            loading ? 'cursor-not-allowed opacity-50' : 'hover:border-red-400 hover:text-red-300'
                          }`}
                          onClick={() => onFileSelection(null)}
                          type="button"
                          disabled={loading}
                          aria-disabled={loading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}

                    <div className="space-y-3">
                      <label className="flex items-center justify-between text-[0.6rem] uppercase tracking-[0.4em] text-zinc-500">
                        <span>Paste Text</span>
                        <span>{resumeInput.trim().length} chars</span>
                      </label>
                      <div className="relative">
                        <textarea
                          value={resumeInput}
                          onChange={(event) => onResumeInputChange(event.target.value)}
                          disabled={loading}
                          placeholder="Paste your resume. Include those inflated titles, random bootcamps, and that one ‘stealth startup’ that never shipped."
                          className="min-h-[150px] w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-zinc-100 shadow-inner shadow-black/50 outline-none transition focus:border-red-400 focus:ring-1 focus:ring-red-500/40 disabled:opacity-60"
                        />
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 rounded-b-2xl bg-gradient-to-t from-black/70 to-transparent" />
                      </div>
                    </div>

                    {error && (
                      <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-100">
                        <p className="font-semibold uppercase tracking-wide">Error</p>
                        <p>{error}</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={onRoast}
                      disabled={loading}
                      className={`relative w-full overflow-hidden rounded-2xl border border-red-500/50 bg-gradient-to-r from-red-500 to-rose-500 px-6 py-4 text-lg font-bold uppercase tracking-[0.3em] text-black shadow-[0_0_40px_rgba(244,63,94,0.35)] transition hover:shadow-red-500/60 focus:outline-none focus:ring-2 focus:ring-red-500/40 ${
                        loading ? 'cursor-wait opacity-70' : 'animate-pulse-glow'
                      }`}
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-3">
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Cooking your roast...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-3">
                          <Flame className="h-5 w-5" />
                          Roast Me
                        </span>
                      )}
                      <span className="pointer-events-none absolute inset-0 opacity-0 transition hover:opacity-20" />
                    </button>

                    <p className="text-center text-[0.65rem] text-zinc-500">
                      I&apos;ll use both inputs if you provide them. Otherwise I&apos;ll roast whatever looks most roastable.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.verdictCard}>
              <div className="pointer-events-none absolute -left-6 top-6 h-20 w-20 rounded-full bg-red-500/15 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-8 right-4 h-24 w-24 rounded-full bg-rose-500/25 blur-3xl" />
              <div className="relative flex flex-col gap-5 h-full">
                <header className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.5em] text-red-400">Verdict</p>
                  <h2 className="text-2xl font-semibold text-white">{result ? 'Roast delivered' : 'Awaiting victim'}</h2>
                </header>

                <div className={styles.verdictScroll}>
                  {result ? (
                    <div className="space-y-6 animate-slide-up">
                      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-red-500/20 to-transparent p-6">
                        <p className="text-xs uppercase tracking-[0.4em] text-zinc-400">Score</p>
                        <div className="mt-4 flex items-end gap-4">
                          <span className={`text-6xl font-bold ${scoreColor}`}>{result.score}</span>
                          <span className="text-2xl text-zinc-500">/100</span>
                        </div>
                        <div className="mt-4 h-2 rounded-full bg-white/10">
                          <div
                            className={`h-full rounded-full ${
                              result.score >= 75 ? 'bg-emerald-400' : result.score >= 45 ? 'bg-amber-300' : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.min(result.score, 100)}%` }}
                          />
                        </div>
                        <p className="mt-3 text-xs text-zinc-400">
                          {result.score >= 75 ? 'Okay show-off.' : result.score >= 45 ? 'Mid. Fix it.' : 'Yikes. Burn it down and rebuild.'}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                        <p className="text-xs uppercase tracking-[0.4em] text-zinc-400">Vibe Check</p>
                        <p className="mt-3 text-lg italic text-zinc-100">{result.vibe_check}</p>
                      </div>

                      <div className="space-y-3">
                        <p className="text-xs uppercase tracking-[0.4em] text-red-400">Roast Points</p>
                        <ul className="space-y-2">
                          {result.roast_points.map((point, index) => (
                            <li
                              key={`${index}-${point.slice(0, 12)}`}
                              className="group flex items-start gap-3 rounded-2xl border border-white/5 bg-white/5 p-3 text-sm text-zinc-200 transition hover:border-red-400/40"
                            >
                              <span className="text-red-400">{String(index + 1).padStart(2, '0')}</span>
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/10 p-5 text-sm">
                        <p className="text-xs uppercase tracking-[0.4em] text-emerald-200">Redemption Arc</p>
                        <p className="mt-3 text-emerald-50">{result.redemption_advice}</p>
                      </div>

                      <button
                        onClick={() => onCopy(copyPayload)}
                        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white transition hover:border-red-400/40"
                      >
                        {copied ? (
                          <>
                            <Check className="h-4 w-4 text-emerald-300" /> Copied
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4" /> Copy Results
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="space-y-3 rounded-2xl border border-white/5 bg-white/5 p-6 text-sm text-zinc-400">
                        <div className="flex items-center gap-3">
                          <Flame className="h-5 w-5 text-red-400" />
                          <p>Upload a resume or paste text to unleash RoastBot.</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Sparkles className="h-5 w-5 text-red-300" />
                          <p>He&apos;ll hand back a score, vibe check, roast points, and an actual action item.</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-red-200" />
                          <p>PDFs work best. Just keep it under 2MB.</p>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-white/5 bg-white/5 p-6">
                        <div className="h-24 w-full animate-shimmer rounded-xl bg-gradient-to-r from-zinc-800 via-zinc-900 to-zinc-800" />
                        <div className="mt-4 space-y-2">
                          <div className="h-3 w-3/4 animate-shimmer rounded-full bg-zinc-800" />
                          <div className="h-3 w-2/4 animate-shimmer rounded-full bg-zinc-800" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          <footer className={`flex-shrink-0 text-center text-zinc-500 ${styles.footerText}`}>
            Built by <span className="text-zinc-300 font-semibold">Yukhym Rubin</span>. Hire me before I build an AI to replace you.{' '}
            <a
              href="https://www.linkedin.com/in/yukhym-rubin-810682125/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-400 hover:text-red-300"
            >
              LinkedIn
            </a>
          </footer>
        </div>
      </main>

      {loading && (
        <div className="flame-floor">
          {Array.from({ length: 6 }).map((_, index) => (
            <span key={index} className="flame-spark" style={{ animationDelay: `${index * 0.15}s` }} />
          ))}
        </div>
      )}
    </div>
  );
}
