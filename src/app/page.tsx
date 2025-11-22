'use client';

import { type DragEvent, useRef, useState } from 'react';
import { Check, Copy, FileText, Flame, Loader2, Sparkles, Trash2, Upload } from 'lucide-react';

interface RoastResult {
  score: number;
  vibe_check: string;
  roast_points: string[];
  redemption_advice: string;
}

const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024;
const SUPPORTED_FILE_TEXT = '.pdf, .txt, .md (max 2MB)';

export default function Home() {
  const [resumeInput, setResumeInput] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RoastResult | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileSelection = (file: File | null) => {
    if (loading) {
      return;
    }

    if (!file) {
      setResumeFile(null);
      return;
    }

    const extension = file.name.split('.').pop()?.toLowerCase();
    const isPdf = file.type === 'application/pdf' || extension === 'pdf';
    const isPlainText = file.type.startsWith('text/') || ['txt', 'md', 'markdown'].includes(extension || '');

    if (!isPdf && !isPlainText) {
      setError('Upload a PDF or plain text file. No, PowerPoints do not count.');
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError('Keep it under 2MB. Resumes, not novels.');
      return;
    }

    setError('');
    setResumeFile(file);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      handleFileSelection(file);
    }
  };

  const handleRoast = async () => {
    if (!resumeFile && !resumeInput.trim()) {
      setError("Paste something or upload a file. I can't roast thin air.");
      return;
    }

    setError('');
    setLoading(true);
    setResult(null);
    setCopied(false);

    try {
      const formData = new FormData();
      formData.append('resumeText', resumeInput.trim());
      if (resumeFile) {
        formData.append('resumeFile', resumeFile);
      }

      const response = await fetch('/api/roast', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to roast resume' }));
        throw new Error(errorData.error || 'Failed to roast resume');
      }

      const data: RoastResult = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred. Even the AI gave up.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scoreAccent = result && (result.score >= 75 ? 'text-emerald-400' : result.score >= 45 ? 'text-amber-300' : 'text-red-500');

  return (
    <div className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-zinc-950 text-zinc-100 font-mono">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(248,113,113,0.25),_transparent_65%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(120deg,rgba(244,63,94,0.12)_1px,transparent_1px),linear-gradient(-120deg,rgba(244,63,94,0.08)_1px,transparent_1px)] [background-size:50px_50px]" />
      <div className="pointer-events-none absolute -top-40 -right-24 h-[28rem] w-[28rem] rounded-full bg-red-500/25 blur-3xl animate-orbit" />
      <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-rose-500/20 blur-3xl animate-orbit [animation-direction:reverse]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black via-black/70 to-transparent" />

      <main className="relative z-10 h-full w-full max-w-6xl px-6">
        <div className="flex h-full flex-col gap-6 rounded-[32px] border border-white/10 bg-zinc-950/70 p-6 shadow-[0_0_80px_rgba(244,63,94,0.25)] backdrop-blur-2xl">
          <section className="flex flex-col items-center gap-4 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.3em] text-red-300">
              <Sparkles className="h-4 w-4 text-red-400" /> Brutalist Career Interventions
            </span>
            <div className="space-y-3">
              <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl">
                Drop your resume. Get roasted. <span className="text-red-400">Emerge stronger.</span>
              </h1>
              <p className="text-sm text-zinc-400 sm:text-base">
                Upload a PDF or paste the text. RoastBot will vaporize your buzzwords, score your delusions, and hand you a redemption arc you&apos;ll pretend you thought of.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-[0.65rem] text-zinc-400 sm:text-xs">
              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur">Auto-sarcasm engine v4.0</div>
              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur">FAANG-grade snark</div>
              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur">Score, vibe, roast &amp; redemption</div>
            </div>
          </section>

          <section className="grid flex-1 gap-6 overflow-hidden lg:grid-cols-[1.1fr_0.9fr]">
            <div className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-black/40 p-6 shadow-inner shadow-red-900/30">
              <div className="pointer-events-none absolute inset-0 opacity-30 [background:radial-gradient(circle_at_top,_rgba(248,113,113,0.3),transparent_65%)]" />
              <div className="relative flex h-full flex-col gap-5">
                <header className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.5em] text-red-400">Input</p>
                  <h2 className="text-2xl font-semibold text-white">Fuel the Roast</h2>
                  <p className="text-xs text-zinc-500 sm:text-sm">Paste text, upload a file, or both. RoastBot will find something to roast.</p>
                </header>

                <div className="flex flex-1 flex-col gap-5 overflow-hidden">
                  <div className="flex-1 space-y-5 overflow-auto pr-2">
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
                      onDrop={handleDrop}
                      className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-all duration-300 ${
                        dragActive
                          ? 'border-red-400 bg-red-500/10'
                          : 'border-white/10 bg-zinc-950/60 hover:border-red-400/80'
                      } ${loading ? 'pointer-events-none opacity-60' : ''}`}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input
                        type="file"
                        accept=".pdf,.txt,.md,.markdown"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={(event) => handleFileSelection(event.target.files?.[0] ?? null)}
                      />
                      <div className="flex flex-col items-center gap-3">
                        <div className="rounded-full border border-white/10 bg-white/5 p-4 text-red-300">
                          <Upload className="h-6 w-6" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-white">Drag &amp; drop your resume</p>
                          <p className="text-xs text-zinc-500">{SUPPORTED_FILE_TEXT}</p>
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
                          onClick={() => handleFileSelection(null)}
                          type="button"
                          disabled={loading}
                          aria-disabled={loading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}

                    <div className="space-y-3">
                      <label className="flex items-center justify-between text-[0.6rem] uppercase tracking-[0.4em] text-zinc-500 sm:text-xs">
                        <span>Paste Text</span>
                        <span>{resumeInput.trim().length} chars</span>
                      </label>
                      <div className="relative">
                        <textarea
                          value={resumeInput}
                          onChange={(event) => setResumeInput(event.target.value)}
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
                      onClick={handleRoast}
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
                        <span className="flex items-center justify-center gap-3 cursor-pointer">
                          <Flame className="h-5 w-5" />
                          Roast Me
                        </span>
                      )}
                      <span className="pointer-events-none absolute inset-0 opacity-0 transition hover:opacity-20" />
                    </button>

                    <p className="text-center text-[0.65rem] text-zinc-500 sm:text-xs">
                      I&apos;ll use both inputs if you provide them. Otherwise I&apos;ll roast whatever looks most roastable.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-black/40 p-6 shadow-2xl shadow-red-500/10">
              <div className="pointer-events-none absolute -left-6 top-6 h-20 w-20 rounded-full bg-red-500/15 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-8 right-4 h-24 w-24 rounded-full bg-rose-500/25 blur-3xl" />
              <div className="relative flex h-full flex-col gap-5">
                <header className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.5em] text-red-400">Verdict</p>
                  <h2 className="text-2xl font-semibold text-white">{result ? 'Roast delivered' : 'Awaiting victim'}</h2>
                </header>

                <div className="flex-1 overflow-auto space-y-6 pr-2">
                  {result ? (
                    <div className="space-y-6 animate-slide-up">
                      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-red-500/20 to-transparent p-6">
                        <p className="text-xs uppercase tracking-[0.4em] text-zinc-400">Score</p>
                        <div className="mt-4 flex items-end gap-4">
                          <span className={`text-6xl font-bold ${scoreAccent}`}>{result.score}</span>
                          <span className="text-2xl text-zinc-500">/100</span>
                        </div>
                        <div className="mt-4 h-2 rounded-full bg-white/10">
                          <div
                            className={`h-full rounded-full ${result.score >= 75 ? 'bg-emerald-400' : result.score >= 45 ? 'bg-amber-300' : 'bg-red-500'}`}
                            style={{ width: `${Math.min(result.score, 100)}%` }}
                          />
                        </div>
                        <p className="mt-3 text-xs text-zinc-400">{result.score >= 75 ? 'Okay show-off.' : result.score >= 45 ? 'Mid. Fix it.' : 'Yikes. Burn it down and rebuild.'}</p>
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
                        onClick={() =>
                          copyToClipboard(
                            `RESUME ROAST:\n\nScore: ${result.score}/100\nVibe: ${result.vibe_check}\n\nRoasts:\n${result.roast_points
                              .map((point) => `- ${point}`)
                              .join('\n')}\n\nAdvice: ${result.redemption_advice}`
                          )
                        }
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

          <footer className="flex-shrink-0 text-center text-[0.65rem] text-zinc-500 sm:text-xs">
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
