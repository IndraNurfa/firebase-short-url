'use client';

import { useEffect, useState } from 'react';
import { ArrowUpRight, Check, Copy } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

type Mode = 'short' | 'temporary';
type Result = { kind: Mode; path: string; expiresAt?: number };

const MODES: { value: Mode; title: string; hint: string }[] = [
  { value: 'short', title: 'Short link', hint: 'Saved, no expiry' },
  { value: 'temporary', title: 'Temporary link', hint: 'Expires in 5 minutes' },
];

const fieldBase =
  'w-full rounded-md border border-hairline-strong bg-surface text-ink placeholder:text-dim font-mono text-[13px] transition-colors focus:border-ink focus:outline-none';

function formatRemaining(ms: number) {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const m = String(Math.floor(total / 60)).padStart(2, '0');
  const s = String(total % 60).padStart(2, '0');
  return `${m}:${s}`;
}

export default function Home() {
  const [mode, setMode] = useState<Mode>('short');
  const [longUrl, setLongUrl] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<Result | null>(null);
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState('');
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  // Drives the visible countdown for temporary links only.
  useEffect(() => {
    if (result?.kind !== 'temporary') return;
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [result]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setCopied(false);
    setLoading(true);

    if (!longUrl) {
      setError('Enter a URL to shorten.');
      setLoading(false);
      return;
    }

    try {
      const temporary = mode === 'temporary';
      const res = await fetch(temporary ? '/api/temporary' : '/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          temporary ? { longUrl } : { longUrl, customUrl: customUrl.trim() || undefined }
        ),
      });
      const data = await res.json();

      if (res.ok) {
        setResult(
          temporary
            ? { kind: 'temporary', path: data.path, expiresAt: data.expiresAt }
            : { kind: 'short', path: data.shortUrl }
        );
      } else {
        setError(data.error || 'Something went wrong. Try again.');
      }
    } catch (err) {
      console.error('Something went wrong', err);
      setError('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const fullUrl = result ? `${origin}/${result.path}` : '';
  const remaining = result?.expiresAt ? result.expiresAt - now : 0;
  const expired = result?.kind === 'temporary' && remaining <= 0;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('Copy failed. Select the link and copy it manually.');
    }
  };

  return (
    <main className="mx-auto w-full max-w-[1200px] px-4 sm:px-6">
      <section className="pb-16 pt-10 lg:pb-24 lg:pt-12">
        <h1 className="max-w-[14ch] text-[clamp(2.25rem,6vw,3.75rem)] font-normal leading-[1.08] tracking-[-0.03em] text-ink text-balance">
          Long links, made short.
        </h1>
        <p className="mt-4 max-w-[52ch] text-base text-body">
          Paste a URL for a permanent short link, or switch to a temporary one that expires in
          five minutes.
        </p>

        <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-16">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 lg:col-span-7" noValidate>
            <fieldset>
              <legend className="sr-only">Link type</legend>
              <div className="grid grid-cols-2 gap-1 rounded-lg border border-hairline bg-canvas-soft p-1">
                {MODES.map((m) => (
                  <label
                    key={m.value}
                    className={cn(
                      'flex cursor-pointer flex-col gap-0.5 rounded-md px-4 py-3 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink',
                      mode === m.value
                        ? 'bg-surface-strong text-ink'
                        : 'text-dim hover:text-body'
                    )}
                  >
                    <input
                      type="radio"
                      name="mode"
                      value={m.value}
                      checked={mode === m.value}
                      onChange={() => setMode(m.value)}
                      className="sr-only"
                    />
                    <span className="text-sm font-medium">{m.title}</span>
                    <span className="text-[13px] leading-tight">{m.hint}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="flex flex-col gap-2">
              <label htmlFor="longUrl" className="text-sm font-medium text-ink">
                Long URL
              </label>
              <input
                id="longUrl"
                name="longUrl"
                type="url"
                inputMode="url"
                autoComplete="off"
                placeholder="https://example.com/a/very/long/path?with=query"
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
                aria-describedby="longUrl-help"
                className={cn(fieldBase, 'h-11 px-4')}
              />
              <p id="longUrl-help" className="text-[13px] text-dim">
                Must start with http:// or https://
              </p>
            </div>

            {mode === 'short' ? (
              <div className="flex flex-col gap-2">
                <label htmlFor="customUrl" className="text-sm font-medium text-ink">
                  Custom name <span className="font-normal text-dim">(optional)</span>
                </label>
                <div className="flex h-11 items-center rounded-md border border-hairline-strong bg-surface transition-colors focus-within:border-ink">
                  <span className="max-w-[55%] truncate pl-4 font-mono text-[13px] text-dim">
                    {origin}/
                  </span>
                  <input
                    id="customUrl"
                    name="customUrl"
                    type="text"
                    autoComplete="off"
                    placeholder="my-link"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ''))}
                    maxLength={20}
                    aria-describedby="customUrl-help"
                    className="h-full min-w-0 flex-1 bg-transparent pr-4 font-mono text-[13px] text-ink placeholder:text-dim focus:outline-none"
                  />
                </div>
                <p id="customUrl-help" className="text-[13px] text-dim">
                  3 to 20 characters: letters, numbers, hyphens, underscores.
                </p>
              </div>
            ) : (
              <p className="max-w-[56ch] rounded-lg border border-hairline px-4 py-3 text-sm text-body">
                Temporary links have no custom name. The address is long because it carries the
                destination and a signature instead of being stored.
              </p>
            )}

            {error && (
              <p role="alert" className="text-sm text-error">
                {error}
              </p>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-10 items-center whitespace-nowrap rounded-md bg-primary px-[18px] text-sm font-medium text-on-primary transition-[background-color,transform] hover:bg-primary-active active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Creating...' : 'Create link'}
              </button>
            </div>
          </form>

          <aside
            aria-live="polite"
            className="flex min-h-[15rem] flex-col rounded-lg border border-hairline bg-canvas-soft p-5 lg:col-span-5 lg:p-6"
          >
            <p className="text-[13px] text-dim">Your link</p>

            {loading ? (
              <div className="mt-5 flex flex-col gap-3" aria-hidden>
                <div className="h-4 w-11/12 animate-pulse rounded-sm bg-surface-strong motion-reduce:animate-none" />
                <div className="h-4 w-8/12 animate-pulse rounded-sm bg-surface-strong motion-reduce:animate-none" />
                <div className="mt-4 h-9 w-24 animate-pulse rounded-md bg-surface-strong motion-reduce:animate-none" />
              </div>
            ) : result ? (
              <div
                key={result.path}
                className="mt-4 flex flex-1 flex-col animate-in fade-in slide-in-from-bottom-1 duration-300 motion-reduce:animate-none"
              >
                <p
                  className={cn(
                    'break-all font-mono text-[15px] leading-relaxed',
                    expired ? 'text-dim line-through' : 'text-ink'
                  )}
                >
                  {fullUrl}
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleCopy}
                    disabled={expired}
                    className="inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-md border border-hairline-strong bg-surface px-[17px] text-sm font-medium text-ink transition-[background-color,transform] hover:bg-surface-strong active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {copied ? (
                      <>
                        <Check size={16} weight="bold" className="text-success" aria-hidden />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy size={16} weight="bold" aria-hidden />
                        Copy
                      </>
                    )}
                  </button>
                  {!expired && (
                    <a
                      href={`/${result.path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-medium text-ink underline-offset-4 hover:underline"
                    >
                      Open
                      <ArrowUpRight size={14} weight="bold" aria-hidden />
                    </a>
                  )}
                </div>

                {result.kind === 'temporary' && (
                  <p className="mt-auto pt-6 text-sm text-body">
                    {expired ? (
                      <span className="text-error">This link has expired.</span>
                    ) : (
                      <>
                        Expires in{' '}
                        <span className="font-mono tabular-nums text-ink">
                          {formatRemaining(remaining)}
                        </span>
                      </>
                    )}
                  </p>
                )}
              </div>
            ) : (
              <p className="mt-4 max-w-[34ch] text-sm text-dim">
                Your link appears here once you create it.
              </p>
            )}
          </aside>
        </div>
      </section>

      <section className="border-t border-hairline py-16 lg:py-20">
        <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] font-normal leading-[1.2] tracking-[-0.02em] text-ink">
          Two kinds of link
        </h2>
        <div className="mt-10 grid gap-10 md:grid-cols-2 md:gap-0">
          <div className="md:pr-10">
            <h3 className="text-lg font-semibold text-ink">Short link</h3>
            <p className="mt-2 max-w-[44ch] text-[15px] text-body">
              Saved in the database and valid until it is removed. Pick your own name or let one
              be generated.
            </p>
            <p className="mt-4 font-mono text-[13px] text-dim">/k3Vn8Qa</p>
          </div>
          <div className="md:border-l md:border-hairline md:pl-10">
            <h3 className="text-lg font-semibold text-ink">Temporary link</h3>
            <p className="mt-2 max-w-[44ch] text-[15px] text-body">
              Nothing is stored. The destination and expiry are signed into the address, and the
              link stops working five minutes after you create it.
            </p>
            <p className="mt-4 truncate font-mono text-[13px] text-dim">/t/eyJ1IjoiaHR0cHM6Ly9l...</p>
          </div>
        </div>
      </section>
    </main>
  );
}
