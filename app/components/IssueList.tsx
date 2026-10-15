"use client";

import {useEffect, useState} from "react";
import CreateIssueForm from "./CreateIssueForm";

type Issue = {
  id: number;
  title: string;
  description: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
};

const statusStyles: Record<string, string> = {
  OPEN: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  IN_PROGRESS: "bg-amber-50 text-amber-700 ring-amber-600/20",
  CLOSED: "bg-slate-100 text-slate-600 ring-slate-500/20",
};

const statusLabels: Record<string, string> = {
  OPEN: "Open",
  IN_PROGRESS: "In Progress",
  CLOSED: "Closed",
};

export default function IssueList() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    async function fetchIssues() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch("/api/issues");
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to load issues.");
        }

        setIssues(result.data);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Something went wrong.",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchIssues();
  }, [refreshKey]);

  async function updateIssueStatus(issueId: number, status: string) {
    try {
      const response = await fetch(`/api/issues/${issueId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({status}),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update issue status.");
      }

      setIssues((currentIssues) =>
        currentIssues.map((issue) =>
          issue.id === issueId ? {...issue, status: result.data.status} : issue,
        ),
      );
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Failed to update status.",
      );
    }
  }

  async function deleteIssue(issueId: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this issue?",
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`/api/issues/${issueId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete issue.");
      }

      setIssues((currentIssues) =>
        currentIssues.filter((issue) => issue.id !== issueId),
      );
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Unable to delete the issue.",
      );
    }
  }

  return (
    <section className="space-y-8">
      {/* Dashboard heading */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
            Workspace
          </p>

          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Issues
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Track bugs, manage progress, and keep your work organized.
          </p>
        </div>

        <div className="flex w-fit items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-lg font-bold text-blue-700">
            {issues.length}
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-900">Total issues</p>
            <p className="text-xs text-slate-500">In your issue list</p>
          </div>
        </div>
      </header>

      {/* Create issue form */}
      <CreateIssueForm
        onIssueCreated={() => setRefreshKey((current) => current + 1)}
      />

      {/* Issue list heading */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">All issues</h3>
          <p className="mt-1 text-sm text-slate-500">
            Review and update your reported problems.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setRefreshKey((current) => current + 1)}
          disabled={loading}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
          <p className="mt-4 text-sm font-medium text-slate-700">
            Loading your issues...
          </p>
          <p className="mt-1 text-sm text-slate-500">Please wait a moment.</p>
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-5"
        >
          <p className="font-semibold text-red-800">Unable to load issues</p>
          <p className="mt-1 text-sm text-red-700">{error}</p>

          <button
            type="button"
            onClick={() => setRefreshKey((current) => current + 1)}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Try again
          </button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && issues.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl text-blue-600">
            +
          </div>

          <h3 className="mt-4 text-lg font-semibold text-slate-900">
            No issues yet
          </h3>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
            Your workspace is clear. Use the form above to report your first bug
            or task.
          </p>
        </div>
      )}

      {/* Issue cards */}
      {!loading && !error && issues.length > 0 && (
        <div className="grid gap-4">
          {issues.map((issue) => (
            <article
              key={issue.id}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:border-blue-200 hover:shadow-md sm:p-6"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-500">
                      BUG-{issue.id}
                    </span>

                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
                        statusStyles[issue.status] ??
                        "bg-slate-100 text-slate-600 ring-slate-500/20"
                      }`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {statusLabels[issue.status] ?? issue.status}
                    </span>
                  </div>

                  <h4 className="mt-3 break-words text-lg font-semibold text-slate-900">
                    {issue.title}
                  </h4>

                  <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-slate-600">
                    {issue.description || "No description provided."}
                  </p>

                  <p className="mt-4 text-xs text-slate-400">
                    Created{" "}
                    {new Date(issue.createdAt).toLocaleDateString(undefined, {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <label htmlFor={`status-${issue.id}`} className="sr-only">
                    Update status for {issue.title}
                  </label>

                  <select
                    id={`status-${issue.id}`}
                    value={issue.status}
                    onChange={(event) =>
                      updateIssueStatus(issue.id, event.target.value)
                    }
                    className="min-w-36 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  >
                    <option value="OPEN">Open</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="CLOSED">Closed</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => deleteIssue(issue.id)}
                    aria-label={`Delete ${issue.title}`}
                    className="rounded-lg border border-red-100 bg-red-50 px-3 py-2.5 text-sm font-medium text-red-600 transition hover:border-red-200 hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {!loading && !error && issues.length > 0 && (
        <p className="text-center text-xs text-slate-400">
          Showing {issues.length} {issues.length === 1 ? "issue" : "issues"}
        </p>
      )}
    </section>
  );
}
