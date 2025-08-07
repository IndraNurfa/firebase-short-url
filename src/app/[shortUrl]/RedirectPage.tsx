'use client';

import { useEffect, useState } from 'react';

type RedirectPageProps = {
  destinationUrl: string | null;
  error?: string | null;
};

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
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-4xl font-bold text-red-500">Error</h1>
        <p className="text-lg mt-4">{error}</p>
      </div>
    );
  }

  if (!destinationUrl) {
      return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center text-center p-4">
          <h1 className="text-4xl font-bold text-red-500">URL Not Found</h1>
          <p className="text-lg mt-4">The short URL you are looking for does not exist.</p>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-4xl font-bold text-cyan-400">Redirecting</h1>
      <p className="text-lg mt-4">You are being sent to:</p>
      <p className="text-xl font-medium text-cyan-300 break-all">{destinationUrl}</p>
      <p className="text-lg mt-8">in {countdown}...</p>
    </div>
  );
}
