"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-4 text-center">
      <AlertTriangle className="text-bearish" size={28} aria-hidden="true" />
      <h1 className="mt-3 text-lg font-semibold text-text-primary">Couldn&apos;t load the dashboard</h1>
      <p className="mt-1 text-sm text-text-secondary">
        Something went wrong fetching today&apos;s Gold data. This is usually temporary.
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="mt-4 rounded-md border border-border px-3 py-1.5 text-sm text-text-primary hover:bg-card-hover"
      >
        Try again
      </button>
    </main>
  );
}
