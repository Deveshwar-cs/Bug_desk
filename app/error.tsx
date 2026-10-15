"use client";

import {useEffect} from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & {digest?: string};
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <main className="p-8">
      <h2 className="text-xl font-bold">Something went wrong!</h2>

      <p className="mt-2">We couldn&apos;t load this page.</p>

      <button
        onClick={() => reset()}
        className="mt-4 rounded bg-blue-600 px-4 py-2 text-white"
      >
        Try again
      </button>
    </main>
  );
}
