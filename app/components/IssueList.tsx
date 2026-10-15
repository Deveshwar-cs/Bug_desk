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

export default function IssueList() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    async function fetchIssues() {
      try {
        const response = await fetch("/api/issues");

        if (!response.ok) {
          throw new Error("Failed to load issues.");
        }

        const result = await response.json();
        setIssues(result.data);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Something went wrong!",
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
        throw new Error(result.message || "Failed to update issue");
      }

      setIssues((currentIssues) =>
        currentIssues.map((issue) =>
          issue.id === issueId ? {...issue, status: result.data.status} : issue,
        ),
      );
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Failed to update the status",
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
        throw new Error(result.message || "Failed to delete issue");
      }

      setIssues((currentIssues) =>
        currentIssues.filter((issue) => issue.id !== issueId),
      );
    } catch (error) {
      alert(error instanceof Error ? error.message : "Unable to update!!");
    }
  }

  if (loading) {
    return <p>Loading issues...</p>;
  }

  if (error) {
    return <p role="alert">{error}</p>;
  }

  if (issues.length === 0) {
    return <p>No issues found. Create your first issue soon!</p>;
  }
  return (
    <div className="space-y-3">
      <CreateIssueForm
        onIssueCreated={() => setRefreshKey((current) => current + 1)}
      />
      {issues.map((issue) => (
        <article
          key={issue.id}
          className="rounded-xl border border-gray-200 p-4"
        >
          <h2 className="font-semibold">{issue.title}</h2>

          <p className="mt-1 text-sm text-gray-600">
            {issue.description || "No description provided."}
          </p>

          <div className="mt-3 flex items-center gap-3">
            <span className="text-sm">Status:</span>

            <select
              value={issue.status}
              onChange={(event) =>
                updateIssueStatus(issue.id, event.target.value)
              }
              className="rounded-lg border p-2 text-sm"
            >
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="CLOSED">Closed</option>
            </select>

            <button
              type="button"
              onClick={() => deleteIssue(issue.id)}
              className="rounded-lg bg-red-100 px-3 py-2 text-sm text-red-700 hover:bg-red-200"
            >
              Delete
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
