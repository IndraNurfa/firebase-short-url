'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from '@phosphor-icons/react';

type RedirectPageProps = {
  destinationUrl: string | null;
  error?: string | null;
};

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto w-full max-w-[1200px] px-4 py-16 sm:px-6 lg:py-24">
      <div className="max-w-2xl">{children}</div>
    </main>
  );
}

function HomeLink() {
  return (
    <Link
      href="/"
      className="mt-8 inline-flex h-10 items-center rounded-md border border-hairline-strong bg-surface px-[17px] text-sm font-medium text-ink transition-colors hover:bg-surface-strong"
    >
      Create a link
    </Link>
  );
}

export default function RedirectPage({ destinationUrl, error }: RedirectPageProps) {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (destinationUrl) {
      const timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);

      if (countdown <= 0) {
        clearInterval(timer);
        window.location.href = destinationUrl;
      }

      return () => clearInterval(timer);
    }
  }, [destinationUrl, countdown]);

  if (error) {
    return (
      <Shell>
        <h1 className="text-4xl font-normal tracking-[-0.03em] text-ink">Link unavailable</h1>
        <p className="mt-4 text-base text-error">{error}</p>
        <HomeLink />
      </Shell>
    );
  }

  if (!destinationUrl) {
    return (
      <Shell>
        <h1 className="text-4xl font-normal tracking-[-0.03em] text-ink">Link not found</h1>
        <p className="mt-4 text-base text-body">The short URL you are looking for does not exist.</p>
        <HomeLink />
      </Shell>
    );
  }

  let parsed: URL | null = null;
  try {
    parsed = new URL(destinationUrl);
  } catch {
    parsed = null;
  }

  if (!parsed || (parsed.protocol !== 'http:' && parsed.protocol !== 'https:')) {
    return (
      <Shell>
        <h1 className="text-4xl font-normal tracking-[-0.03em] text-ink">Link unavailable</h1>
        <p className="mt-4 text-base text-error">This link points to an unsupported address.</p>
        <HomeLink />
      </Shell>
    );
  }

  const rest = `${parsed.pathname === '/' ? '' : parsed.pathname}${parsed.search}${parsed.hash}`;
  const seconds = Math.max(countdown, 0);

  return (
    <Shell>
      <a
        href={destinationUrl}
        className="group block rounded-lg border border-hairline bg-canvas-soft transition-colors hover:border-hairline-strong hover:bg-surface"
      >
        <span className="block p-5 sm:p-6">
          <span className="block text-sm text-dim">Taking you to</span>
          <span className="mt-2 block break-words text-[clamp(1.5rem,4vw,2.25rem)] font-normal leading-[1.15] tracking-[-0.02em] text-ink group-hover:underline group-hover:underline-offset-4">
            {parsed.host}
          </span>
          {rest && (
            <span className="mt-3 block break-all font-mono text-[13px] leading-relaxed text-dim">
              {rest}
            </span>
          )}
        </span>
        <span className="flex items-center justify-between gap-4 border-t border-hairline px-5 py-3 text-sm sm:px-6">
          <span role="timer" className="text-body">
            Redirecting in{' '}
            <span className="font-mono tabular-nums text-ink">{seconds}s</span>
          </span>
          <span className="inline-flex items-center gap-1 font-medium text-ink">
            Go now
            <ArrowUpRight
              size={14}
              weight="bold"
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none"
              aria-hidden
            />
          </span>
        </span>
      </a>
    </Shell>
  );
}
