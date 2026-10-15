"use client";

import {useState} from "react";

type CreateIssueFormProps = {
  onIssueCreated: () => void;
};

export default function CreateIssueForm({
  onIssueCreated,
}: CreateIssueFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Please enter an issue title.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/issues", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create issue.");
      }

      setTitle("");
      setDescription("");
      onIssueCreated();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 bg-slate-50/80 px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-2xl font-light text-white">
            +
          </div>

          <div>
            <h3 className="font-semibold text-slate-900">Report a new issue</h3>
            <p className="mt-1 text-sm text-slate-500">
              Describe the problem you want to track.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 p-5 sm:p-6">
        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <label
              htmlFor="title"
              className="text-sm font-semibold text-slate-800"
            >
              Issue title <span className="text-red-500">*</span>
            </label>

            <span className="text-xs text-slate-400">{title.length}/120</span>
          </div>

          <input
            id="title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="e.g. Login button is not working"
            maxLength={120}
            required
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
          />

          <p className="mt-2 text-xs text-slate-400">
            Keep it short and specific.
          </p>
        </div>

        <div>
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-semibold text-slate-800"
          >
            Description
            <span className="ml-2 font-normal text-slate-400">(Optional)</span>
          </label>

          <textarea
            id="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="What happened? What did you expect to happen?"
            rows={4}
            maxLength={2000}
            className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
          />

          <p className="mt-2 text-right text-xs text-slate-400">
            {description.length}/2000 characters
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-slate-400">
            Fields marked with * are required.
          </p>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Creating issue...
              </>
            ) : (
              "Create issue"
            )}
          </button>
        </div>
      </form>
    </section>
  );
}
