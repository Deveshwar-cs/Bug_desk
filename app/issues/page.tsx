type Issue = {
  id: number;
  title: string;
  status: string;
};

async function getIssues(): Promise<Issue[]> {
  return [
    {id: 101, title: "Login button is broken", status: "Open"},
    {id: 102, title: "Dashboard is not loading", status: "In Progress"},
    {id: 103, title: "Image upload fails", status: "Resolved"},
  ];
}

export default async function IssuesPage() {
  const issues = await getIssues();

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-slate-900">All Issues</h1>

        <div className="mt-6 space-y-3">
          {issues.map((issue) => (
            <div key={issue.id} className="rounded-xl border bg-white p-4">
              <h2 className="font-semibold">{issue.title}</h2>
              <p className="mt-1 text-sm text-slate-600">
                Status: {issue.status}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
